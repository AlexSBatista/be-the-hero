const socketio = require('socket.io');

let io;
const connections = [];

exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        console.log(socket.id);
        connections.push({
            id: socket.id,
        })
    });
};

exports.getConnections = () => {
  return  connections;
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    });
};