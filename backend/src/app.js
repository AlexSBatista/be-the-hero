const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const http = require('http');
const routes = require('./routes');

const { setupWebsocket } = require('./websocket');
const app = express();

const server = http.Server(app);

setupWebsocket(server);

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

app.get('/', (request, response) => {
    return response.json({
        evento: 'SemanaOmniStack',
        aluno: 'Alex Silva'
    });
});

module.exports = server;