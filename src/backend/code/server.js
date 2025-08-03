'use strict';

const cors = require('cors');
const path = require('path');
const express = require('express');
const q = require('./queries');

const app = express();
const PORT = process.env.PORT || 80;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (request, response) {
    response.json({ message: 'alive' });
});

app.get('/api/init', function (request, response, next) {
    try {
        response.json(q.init());
    } catch (e) {
        console.error(e.message);
        next(err);
    }
});

app.get('/api/employees', function (request, response, next) {
    try {
        response.json(q.get_employees(request.query));
    } catch (e) {
        console.error(e.message);
        next(e);
    }
});

app.get('/api/devices', function (request, response, next) {
    try {
        response.json(q.get_devices(request.query));
    } catch (e) {
        console.error(e.message);
        next(e);
    }
});

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
});