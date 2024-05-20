const net = require('net');

const EVENT = {
  TURN_ON: '000000000000000000002',
  TURN_OFF: '000000000000000000022',
};

const RESPONSE = {
  ON: '$EMS,1351219863,GET,2000#',
  OFF: '$EMS,1351219863,GET,2002#',
};

let valueOfLight = RESPONSE.ON;

const client = new net.Socket();
client.connect(11000, '127.0.0.1', function () {
  client.write(valueOfLight);
  console.log('Connected');
});

client.on('data', function (data) {
  const parseData = data.toString();

  if (parseData === EVENT.TURN_ON) {
    valueOfLight = switchLight(EVENT.TURN_ON);
    return client.write(valueOfLight);
  }

  if (parseData === EVENT.TURN_OFF) {
    valueOfLight = switchLight(EVENT.TURN_OFF);
    return client.write(valueOfLight);
  }
});

client.on('close', function () {
  console.log('Connection closed');
});

function switchLight(valueInput) {
  if (valueInput === EVENT.TURN_ON) {
    return RESPONSE.ON;
  }

  if (valueInput === EVENT.TURN_OFF) {
    return RESPONSE.OFF;
  }
}
