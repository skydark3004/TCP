exports.handleWhenDeviceOutConnection = function handleWhenDeviceOutConnection() {
  // Remove client from socket array
  console.log(socket.name + ' left the broadcast.\n');
  socketConnections.splice(socketConnections.indexOf(socket), 1);
};

exports.sendDataToAllClients = function sendDataToAllClients(data, socketConnections) {
  for (const connection of socketConnections) {
    connection.write(data.toString());
  }
};
