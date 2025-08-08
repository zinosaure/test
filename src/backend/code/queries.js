"use strict";

const path = require("path");
const sqlite = require("better-sqlite3");
const fs = require("node:fs");
const database = new sqlite(path.resolve("./static/database.db"), { readonly: false });

const config = {
    item_per_page: process.env.ITEM_PER_PAGE || 10,
};

function query(sql, params) {
    return database.prepare(sql).all(params);
}

function init() {
    database.exec(fs.readFileSync("./setenv/schema.sql", "utf8"));

    fs.readFile("./setenv/data.json", function (error, content) {
        if (error)
            throw error;

        const data = JSON.parse(content);

        var stmt = database.prepare(`INSERT 
            INTO 
                employees(id, employee_name, employee_role) 
            VALUES 
                (@id, @employee_name, @employee_role)
            ON CONFLICT DO NOTHING;
        `);

        for (var i in data.employees)
            stmt.run(data.employees[i]);

        var stmt = database.prepare(`INSERT 
            INTO 
                devices(id, employee_id, device_name, device_type) 
            VALUES 
                (@id, @employee_id, @device_name, @device_type)
            ON CONFLICT DO NOTHING;
        `);

        for (var i in data.devices)
            stmt.run(data.devices[i]);
    });
}

function list_employees(params) {
    if (!params.length)
        params = { page: 1 };

    const offset = (params.page - 1) * config.item_per_page;
    const tdata = query(`SELECT 
            *,
            (SELECT COUNT(id) FROM employees) AS TOTAL_ITEMS
        FROM 
            employees 
        ORDER BY 
            id DESC
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

function get_devices_by_employee(employee_id) {
    return query(`SELECT 
            * 
        FROM 
            devices
        WHERE 
            employee_id = @employee_id;
    `, { employee_id: employee_id });
}

function list_devices(params) {
    if (!params.length)
        params = { page: 1 };

    const offset = (params.page - 1) * config.item_per_page;
    const data = query(`SELECT 
            *,
            (SELECT COUNT(id) FROM devices) AS TOTAL_ITEMS
        FROM 
            devices
        INNER JOIN 
            employees
                ON employees.id = devices.employee_id
        ORDER BY 
            id DESC
        LIMIT 
            ?, ?;
    `, [offset, config.item_per_page]);
    const meta = {
        page: parseInt(params.page),
        total_items: data.length > 0 ? data[0].TOTAL_ITEMS : 0,
    };

    return { data, meta };
}

function upsert_employee(payload) {

}

function upsert_device(payload) {

}

function delete_employee(id) {
    return database.prepare(`DELETE
        FROM 
            employees
        WHERE
            id = @id;
    `).run({ id: id });
}

function delete_device(id) {
    return database.prepare(`DELETE
        FROM 
            devices
        WHERE
            id = @id;
    `).run({ id: id });
}

module.exports = {
    init,
    list_employees,
    list_devices,
    upsert_employee,
    upsert_device,
    delete_employee,
    delete_device,
}