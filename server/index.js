const express = require('express');
const app = express();
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { handleWhenDeviceOutConnection, sendDataToAllClients } = require('./tcp-v2');
const net = require('net');

const PORT_TCP = process.env.PORT_TCP || 11000;
const PORT = process.env.PORT_APP || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//open cors for FE connect socket
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.get('/', function (req, res) {
  const { type } = req.body;
  res.status(200).json({ msg: msg || 'hello world' });
});

const server = createServer(app);

server.listen(PORT, () => console.log(`Lisening Server on port `, PORT));

let TcpConnections = [];
// Socket
const io = new Server(server);
io.on('connection', (socket) => {
  console.log('a user connected from socket.io');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('ON_OFF_LIGHT', (value) => {
    const event = {
      type: 'ON_OFF_LIGHT',
    };
    sendDataToAllClients(JSON.stringify(event), TcpConnections);
    console.log('ON_OFF_LIGHT: ', value);
  });

  socket.on('GET_INIT_VALUE_FROM_LIGHT', () => {
    console.log('GET_INIT_VALUE_FROM_LIGHT: ');
    const event = {
      type: 'GET_INIT_VALUE_FROM_LIGHT',
    };
    sendDataToAllClients(JSON.stringify(event), TcpConnections);
  });

});

// TCP
const serverTCP = net.createServer((socket) => {
  TcpConnections.push(socket);

  socket.on('data', (data) => {
    console.log(data.toString());
    const parseData = JSON.parse(data.toString());

    // xử lí các sự kiện mỗi khi nhận về data
    if (parseData.type === 'GET_INIT_VALUE_FROM_LIGHT') {
      io.emit('GET_INIT_VALUE_FROM_LIGHT', parseData.value);
    }

    if (parseData.type === 'ON_OFF_LIGHT') {
      io.emit('ON_OFF_LIGHT', parseData.value);
    }

    console.log('received data from device:', data.toString());
  });

  socket.on('error', function (error) {
    console.log('error:', error);
  });

  socket.on('end', handleWhenDeviceOutConnection);
});

serverTCP.on('connection', function () {
  console.log('A device connected to server...');
});

serverTCP.listen(PORT_TCP, '127.0.0.1', () => {
  console.log('listening TCP on port', PORT);
});
