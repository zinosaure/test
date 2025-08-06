'use strict';

const fs = require('node:fs');
const cors = require('cors');
const path = require('path');
const express = require('express');
// const compression = require('compression')

const app = express();
const PORT = process.env.PORT || 80;

app.use(cors());
// app.use(compression());
app.use('/public', express.static(path.join(__dirname, 'public')));


app.get("/", function (request, response) {
    response.header('Cache-Control', 'private, no-cache, no-store, must-revalidate, max-age=0');
    response.header('Expires', '-1');
    response.header('Pragma', 'no-cache');
    response.header('Content-Type', 'text/html');
    return response.sendFile(path.join(__dirname, '/public/html/index.html'));
});

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
});