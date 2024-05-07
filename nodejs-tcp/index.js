const net = require('net');

let value = 'DEN_1_ON';

const client = new net.Socket();
client.connect(11000, '127.0.0.1', function () {
  console.log('Connected');
});

client.on('data', function (data) {
  const parseData = JSON.parse(data.toString());

  if (parseData.type === 'GET_INIT_VALUE_FROM_LIGHT') {
    const event = {
      type: 'GET_INIT_VALUE_FROM_LIGHT',
      value: value,
    };
    console.log('send data:::', event);
    return client.write(JSON.stringify(event));
  }

  if (parseData.type === 'ON_OFF_LIGHT') {
    value = switchLight(value);
    const event = {
      type: 'ON_OFF_LIGHT',
      value: value,
    };
    console.log('send data with event ON_OFF_LIGHT:::', event);
    return client.write(JSON.stringify(event));
  }

  /*   if (data.toString() === 'DEN_1_ON') {
    value = 'DEN_1_ON';
    return client.write(value);
  }

  if (data.toString() === 'DEN_1_OFF') {
    value = 'DEN_1_OFF';
    return client.write(value);
  } */
});

client.on('close', function () {
  console.log('Connection closed');
});

function switchLight(value) {
  if (value === 'DEN_1_ON') {
    value = 'DEN_1_OFF';
    return value;
  }
  if (value === 'DEN_1_OFF') {
    value = 'DEN_1_ON';
    return value;
  }
}
