const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes');

const app = express();

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

module.exports = app;