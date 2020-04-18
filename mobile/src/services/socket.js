import socketio from 'socket.io-client';

const socket = socketio('http://192.168.0.103:3333', {
    autoConnect: false,
});

function subscribeNewIncident(subscribeFunction){
    socket.on('new-incident', subscribeFunction);
}

function connect() {
    socket.connect();
};

function disconnect() {
    socket.disconnect();
};

export {
    connect,
    disconnect,
    subscribeNewIncident
};