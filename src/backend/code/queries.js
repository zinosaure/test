'use strict';

const path = require('path');
const sqlite = require('better-sqlite3');
const fs = require('node:fs');
// const database = new sqlite(path.resolve('./static/database.db'), { verbose: console.info });
const database = new sqlite(path.resolve('./static/database.db'));

const config = {
    item_per_page: process.env.ITEM_PER_PAGE || 10,
};

const roles = {
    1: "admin",
    2: "chief executor officer",
    3: "chief technical officer",
    4: "chief content officer",
    11: "product manager",
    12: "lead developer",
    13: "devops",
    14: "developer",
    15: "tester",
    16: "trainee",
    21: "it support",
    100: "TBD",
};
const device_types = {
    1: "Laptop",
    2: "Flat Screen",
    3: "Mouse",
    4: "Keyboard",
    5: "Support bag",
    6: "Smartphone",
    7: "SIM Card",
};

function query(sql, params) {
    return database.prepare(sql).all(params);
}

function init() {
    database.exec(fs.readFileSync('./setenv/schema.sql', 'utf8'));

    fs.readFile('./setenv/data.json', function (error, content) {
        if (error)
            throw error;

        const data = JSON.parse(content);

        for (var i in data.employees) {
            database.prepare(`INSERT 
                INTO 
                    employees(id, employee_name, employee_role, employee_photo) 
                VALUES 
                    (?, ?, ?, ?)
                ON CONFLICT DO NOTHING;
            `).run(Object.values(data.employees[i]));
        }

        for (var i in data.devices) {
            database.prepare(`INSERT 
                INTO 
                    devices(id, employee_id, device_name, device_type) 
                VALUES 
                    (?, ?, ?, ?)
                ON CONFLICT DO NOTHING;
            `).run(Object.values(data.devices[i]));
        }
    });
}

function get_employees(params = { page: 1 }) {
    const offset = (params.page - 1) * config.item_per_page;
    const tdata = query(`SELECT 
            *,
            (SELECT COUNT(id) FROM employees) AS TOTAL_ITEMS
        FROM 
            employees 
        LIMIT 
            ?, ?;
    `, [offset, config.item_per_page]);
    const employees = [];
    const meta = {
        page: parseInt(params.page),
        total_items: tdata.length > 0 ? tdata[0].TOTAL_ITEMS : 0,
    };

    for (var i in tdata) {
        tdata[i]["devices"] = get_devices_by_employee(tdata[i].id);
        employees.push(tdata[i]);
    }

    return { employees, meta };
}

function get_devices(params = { page: 1 }) {
    const offset = (params.page - 1) * config.item_per_page;
    const data = query(`SELECT 
            *,
            (SELECT COUNT(id) FROM devices) AS TOTAL_ITEMS
        FROM 
            devices
        INNER JOIN 
            employees
                ON employees.id = devices.employee_id
        LIMIT 
            ?, ?;
    `, [offset, config.item_per_page]);
    const meta = {
        page: parseInt(params.page),
        total_items: data.length > 0 ? data[0].TOTAL_ITEMS : 0,
    };

    return { data, meta };
}

function get_devices_by_employee(employee_id) {
    return query(`SELECT 
            * 
        FROM 
            devices
        WHERE 
            employee_id = ?;
    `, [employee_id]);
}


module.exports = {
    roles,
    device_types,
    init,
    get_employees,
    get_devices
}