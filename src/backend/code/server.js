"use strict";

const cors = require("cors");
const path = require("path");
const express = require("express");
const q = require("./queries");

const app = express();
const PORT = process.env.PORT || 80;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (request, response) {
    response.json({ message: "alive" });
});

app.get("/api/init", function (request, response, next) {
    try {
        response.json(q.init());
    } catch (e) {
        console.error(e.message);
        next(err);
    }
});

app.get("/api/select/options", function (request, response, next) {
    const roles = {
        "admin": "Admin",
        "chief executor officer": "CEO",
        "chief technical officer": "CTO",
        "chief content officer": "CCO",
        "product manager": "PM",
        "lead developer": "Lead Developer",
        "devops": "DevOps",
        "developer": "Developer",
        "tester": "Tester",
        "trainee": "Trainee",
        "it support": "IT Support",
    };
    const device_types = {
        "laptop": "Laptop",
        "flat screen": "Flat Screen",
        "mouse": "Mouse",
        "keyboard": "Keyboard",
        "support bag": "Support bag",
        "smartphone": "Smartphone",
        "SIM card": "SIM Card",
    };

    response.json({ roles, device_types });
});

app.get("/api/list/employees", function (request, response, next) {
    try {
        response.json(q.list_employees(request.query));
    } catch (e) {
        console.error(e.message);
        next(e);
    }
});

app.get("/api/list/devices", function (request, response, next) {
    try {
        response.json(q.list_devices(request.query));
    } catch (e) {
        console.error(e.message);
        next(e);
    }
});

app.post("/api/upsert/employee", function (request, response, next) {
    try {
        response.json(q.upsert_employee(request.body));
    } catch (e) {
        console.error(e.message);
        next(e);
    }
});

app.post("/api/upsert/device", function (request, response, next) {
    try {
        response.json(q.upsert_device(request.body));
    } catch (e) {
        console.error(e.message);
        next(e);
    }
});

app.post("/api/delete/employee", function (request, response, next) {
    try {
        response.json(q.delete_employee(request.body.id));
    } catch (e) {
        console.error(e.message);
        next(e);
    }
});


app.post("/api/delete/device", function (request, response, next) {
    try {
        response.json(q.delete_device(request.body.id));
    } catch (e) {
        console.error(e.message);
        next(e);
    }
});

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
});