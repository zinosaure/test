import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import * as bs from 'react-bootstrap';

let select_options = {}

fetch('http://localhost:3000/api/select/options', {
    headers: {
        "Content-Type": "application/json",
    },
}).then(async response => {
    select_options = await response.json();
});


function TablePagination() {
    return (
        <bs.Pagination>
            <bs.Pagination.First />
            <bs.Pagination.Prev />
            <bs.Pagination.Item>{1}</bs.Pagination.Item>
            <bs.Pagination.Ellipsis />

            <bs.Pagination.Item>{10}</bs.Pagination.Item>
            <bs.Pagination.Item>{11}</bs.Pagination.Item>
            <bs.Pagination.Item active>{12}</bs.Pagination.Item>
            <bs.Pagination.Item>{13}</bs.Pagination.Item>
            <bs.Pagination.Item disabled>{14}</bs.Pagination.Item>

            <bs.Pagination.Ellipsis />
            <bs.Pagination.Item>{20}</bs.Pagination.Item>
            <bs.Pagination.Next />
            <bs.Pagination.Last />
        </bs.Pagination>
    );
}

function Onclick({ onclick, text }) {
    return <a onClick={(e) => onclick(e)} href="#" dangerouslySetInnerHTML={{ __html: text }} />
}

function Table({ labels, endpoint, callback, handle_update }) {
    const [items, setItems] = useState([]);
    const [total_item, setTotalItem] = useState(0);
    const handle_callback = (callback, item) => {
        if (typeof callback == "function")
            return callback(item);

        if (callback in item)
            return item[callback];

        return callback;
    };

    useEffect(() => {
        fetch(endpoint)
            .then((response) => response.json())
            .then((data) => {
                if (callback)
                    return callback(data, setItems, setTotalItem)

                setItems(data);
                setTotalItem(data.length);
            });
    }, [items]);

    return (
        <div>
            <bs.Row className="mb-2">
                <bs.Col md="10">
                    <h6>Found a total of {total_item} items.</h6>
                </bs.Col>
                <bs.Col md="2" className="text-end">
                    {handle_update}
                </bs.Col>
            </bs.Row>
            <bs.Table striped bordered hover responsive>
                <thead key="thead">
                    <tr key="0">
                        {Object.keys(labels).map((label, i) => {
                            return (<th key={i} dangerouslySetInnerHTML={{ __html: label }} />);
                        })}
                    </tr>
                </thead>
                <tbody key="tbody">
                    {total_item == 0 ? <tr key="1">
                        <td key="1" colSpan={Object.keys(labels).length}>Loading data, please wait...</td>
                    </tr> : items.map((item, i) => {
                        return (
                            <tr key={i}>
                                {Object.values(labels).map((callback, j) => {
                                    return (<td key={j}>{handle_callback(callback, item)}</td>);
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </bs.Table>
            <TablePagination />
        </div>
    );
}

function Layout() {
    return (
        <>
            <bs.Container className="mt-4">
                <bs.Card>
                    <bs.Card.Body>
                        <bs.Navbar.Brand href="/?ref=logo">
                            <img className="logo" src="/public/images/fleet.png" />
                        </bs.Navbar.Brand>
                    </bs.Card.Body>
                </bs.Card>
            </bs.Container>
            <bs.Container className="mt-4">
                <bs.Row>
                    <bs.Col md="3">
                        <bs.Card>
                            <bs.Card.Body>
                                <bs.Nav defaultActiveKey="/home" className="flex-column">
                                    <li>
                                        <Link to="/">Employees</Link>
                                    </li>
                                    <li>
                                        <Link to="/devices">Devices</Link>
                                    </li>
                                </bs.Nav>
                            </bs.Card.Body>
                        </bs.Card>
                    </bs.Col>
                    <bs.Col>
                        <bs.Card>
                            <bs.Card.Body>
                                <Outlet />
                            </bs.Card.Body>
                        </bs.Card>
                    </bs.Col>
                </bs.Row>
            </bs.Container>
            <bs.Container className="my-4">
                <bs.Card>
                    <bs.Card.Body>
                        <bs.Row>
                            <bs.Col>
                                <bs.Navbar.Brand href="/?ref=footer">
                                    <img className="logo-sm" src="/public/images/fleet.png" />
                                </bs.Navbar.Brand>
                            </bs.Col>
                            <bs.Col className="text-end">
                                <bs.Navbar.Text >
                                    Done by: <a target="_blank" href="https://github.com/zinosaure">@zinosaure (Gino D.)</a>
                                </bs.Navbar.Text>
                            </bs.Col>
                        </bs.Row>
                    </bs.Card.Body>
                </bs.Card>
            </bs.Container>
        </>
    );
}

const Employee = {
    List: function () {
        return <Table
            labels={{
                "#": "id",
                '<i class="fa-solid fa-pencil"></i>':
                    (item) => <Onclick onclick={() => Employee.handle_update(item)} text={'<i class="fa-solid fa-pencil"></i>'} />,
                '<i class="fa-solid fa-trash"></i>':
                    (item) => <Onclick onclick={() => Employee.handle_delete(item)} text={'<i class="fa-solid fa-trash"></i>'} />,
                "Fullname":
                    "employee_name",
                "Role":
                    (item) => select_options.roles[item.employee_role],
            }}
            endpoint={"http://localhost:3000/api/list/employees"}
            callback={(data, setItems, setTotalItem) => {
                setTimeout(() => {
                    setItems(data.employees);
                    setTotalItem(data.meta.total_items);
                }, 2000);
            }}
            handle_update={<Onclick onclick={() => Employee.handle_update({})} text={'<i class="fa-solid fa-pencil"></i>'} />}
        />
    },

    FormUpsert: function ({ item }) {
        const onChange = (e) => {
            item = { ...item, [e.target.name]: e.target.value };
        };

        return (
            <div>
                <h5>{item.id ? `Update Employee: #${item.id}` : "Insert new Employee"}</h5>
                <hr />
                <bs.Form id="submit-form">
                    <bs.Form.Control
                        type="hidden"
                        name="id"
                        value={item.id}
                        required="1"
                        onChange={e => onChange(e)} />
                    <bs.Form.Group className="mb-3" controlId="employee.name">
                        <bs.Form.Label>
                            Fullname
                        </bs.Form.Label>
                        <bs.Form.Control
                            type="text"
                            name="employee_name"
                            value={item.employee_name}
                            required="1"
                            onChange={e => onChange(e)} />
                    </bs.Form.Group>
                    <bs.Form.Group className="mb-3" controlId="employee.role">
                        <bs.Form.Label>
                            Role
                        </bs.Form.Label>
                        <bs.Form.Select
                            name="employee_role"
                            value={item.employee_role}
                            onChange={e => onChange(e)}>
                            {Object.keys(select_options.roles).map((name, i) => {
                                return <option key={i} value={name}>{select_options.roles[name]}</option>
                            })}
                        </bs.Form.Select>
                    </bs.Form.Group>
                    <hr />
                    <bs.Row>
                        <bs.Col md="6"></bs.Col>
                        <bs.Col md="3">
                            <bs.Button
                                id="cancel"
                                type="button"
                                variant="outline-secondary"
                                className="w-100"
                            >Cancel</bs.Button>
                        </bs.Col>
                        <bs.Col md="3">
                            <bs.Button
                                id="submit"
                                type="button"
                                variant="success"
                                className="w-100"
                            >Submit</bs.Button>
                        </bs.Col>
                    </bs.Row>
                </bs.Form>
            </div>

        );
    },
    FormDelete: function ({ item }) {
        return (<div>
            <h5>Remove this employee #{item.id}?</h5>
            <hr />
            <bs.Row>
                <bs.Col md="6"></bs.Col>
                <bs.Col md="3">
                    <bs.Button
                        id="cancel"
                        type="button"
                        variant="outline-secondary"
                        className="w-100"
                    >No</bs.Button>
                </bs.Col>
                <bs.Col md="3">
                    <bs.Button
                        id="submit"
                        type="button"
                        variant="warning"
                        className="w-100"
                    >Yes</bs.Button>
                </bs.Col>
            </bs.Row>
        </div>);
    },
    handle_update: function (item) {
        const $html = $(renderToString(<Employee.FormUpsert item={item} />));
        const $btn_cancel = $html.find("button#cancel");
        const $btn_submit = $html.find("button#submit");
        const $submit_form = $html.find("#submit-form");

        $btn_cancel.on("click", () => popup.close());
        $btn_submit.on("click", () => {
            const data = {};
            (new FormData($submit_form.get(0))).forEach((v, k) => data[k] = v);

            fetch('http://localhost:3000/api/upsert/employee', {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(async response => {
                const is_json = response.headers.get('content-type')?.includes('application/json');
                const data = is_json && await response.json();

                if (!response.ok)
                    return Promise.reject((data && data.message) || response.status);

                return popup.close();
            }).catch(error => {
                console.error('There was an error!', error);
            });
        });
        popup.open($html, 550, true);
    },
    handle_delete: function (item) {
        const $html = $(renderToString(<Employee.FormDelete item={item} />));

        $html.find("button#cancel").on("click", () => popup.close());
        $html.find("button#submit").on("click", () => {
            fetch('http://localhost:3000/api/delete/employee', {
                method: "POST",
                body: JSON.stringify({ id: item.id }),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(async response => {
                const is_json = response.headers.get('content-type')?.includes('application/json');
                const data = is_json && await response.json();

                if (!response.ok)
                    return Promise.reject((data && data.message) || response.status);

                return popup.close();
            }).catch(error => {
                console.error('There was an error!', error);
            });
        });

        popup.open($html, 500, true);
    },
};

const Device = {
    List: function () {
        return <Table
            labels={{
                "#": "id",
                '<i class="fa-solid fa-pencil"></i>':
                    (item) => <Onclick onclick={() => Device.handle_update(item)} text={'<i class="fa-solid fa-pencil"></i>'} />,
                '<i class="fa-solid fa-trash"></i>':
                    (item) => <Onclick onclick={() => Device.handle_delete(item)} text={'<i class="fa-solid fa-trash"></i>'} />,
                "Device (Type)":
                    (item) => `${item.device_name} (${select_options.device_types[item.device_type]})`,
                "Employee (Role)":
                    (item) => `${item.employee_name} (${select_options.roles[item.employee_role]})`,
            }}
            endpoint={"http://localhost:3000/api/list/devices"}
            callback={(data, setItems, setTotalItem) => {
                setTimeout(() => {
                    setItems(data.devices);
                    setTotalItem(data.meta.total_items);
                }, 2000);
            }}
            handle_update={<Onclick onclick={() => Device.handle_update({})} text={'<i class="fa-solid fa-pencil"></i>'} />}
        />
    },

    FormUpsert: function ({ item }) {
        const onChange = (e) => {
            item = { ...item, [e.target.name]: e.target.value };
        };

        return (
            <div>
                <h5>{item.id ? `Update Device Attribution: #${item.id}` : "Insert new Device Attribution"}</h5>
                <hr />
                <bs.Form id="submit-form">
                    <bs.Form.Control
                        type="hidden"
                        name="id"
                        value={item.id}
                        required="1"
                        onChange={e => onChange(e)} />
                    <bs.Form.Group className="mb-3" controlId="employee.name">
                        <bs.Form.Label>
                            Fullname
                        </bs.Form.Label>
                        <bs.Form.Control
                            type="text"
                            name="employee_name"
                            value={item.employee_name}
                            required="1"
                            onChange={e => onChange(e)} />
                    </bs.Form.Group>
                    <bs.Form.Group className="mb-3" controlId="employee.role">
                        <bs.Form.Label>
                            Role
                        </bs.Form.Label>
                        <bs.Form.Select
                            name="employee_role"
                            value={item.employee_role}
                            onChange={e => onChange(e)}>
                            {Object.keys(select_options.roles).map((name, i) => {
                                return <option key={i} value={name}>{select_options.roles[name]}</option>
                            })}
                        </bs.Form.Select>
                    </bs.Form.Group>
                    <hr />
                    <bs.Row>
                        <bs.Col md="6"></bs.Col>
                        <bs.Col md="3">
                            <bs.Button
                                id="cancel"
                                type="button"
                                variant="outline-secondary"
                                className="w-100"
                            >Cancel</bs.Button>
                        </bs.Col>
                        <bs.Col md="3">
                            <bs.Button
                                id="submit"
                                type="button"
                                variant="success"
                                className="w-100"
                            >Submit</bs.Button>
                        </bs.Col>
                    </bs.Row>
                </bs.Form>
            </div>

        );
    },
    FormDelete: function ({ item }) {
        return (<div>
            <h5>Remove this device #{item.id}?</h5>
            <hr />
            <bs.Row>
                <bs.Col md="6"></bs.Col>
                <bs.Col md="3">
                    <bs.Button
                        id="cancel"
                        type="button"
                        variant="outline-secondary"
                        className="w-100"
                    >No</bs.Button>
                </bs.Col>
                <bs.Col md="3">
                    <bs.Button
                        id="submit"
                        type="button"
                        variant="warning"
                        className="w-100"
                    >Yes</bs.Button>
                </bs.Col>
            </bs.Row>
        </div>);
    },
    handle_update: function (item) {
        const $html = $(renderToString(<Device.FormUpsert item={item} />));
        const $btn_cancel = $html.find("button#cancel");
        const $btn_submit = $html.find("button#submit");
        const $submit_form = $html.find("#submit-form");

        $btn_cancel.on("click", () => popup.close());
        $btn_submit.on("click", () => {
            const data = {};
            (new FormData($submit_form.get(0))).forEach((v, k) => data[k] = v);

            fetch('http://localhost:3000/api/upsert/device', {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(async response => {
                const is_json = response.headers.get('content-type')?.includes('application/json');
                const data = is_json && await response.json();

                if (!response.ok)
                    return Promise.reject((data && data.message) || response.status);

                return popup.close();
            }).catch(error => {
                console.error('There was an error!', error);
            });
        });
        popup.open($html, 550, true);
    },
    handle_delete: function (item) {
        const $html = $(renderToString(<Device.FormDelete item={item} />));

        $html.find("button#cancel").on("click", () => popup.close());
        $html.find("button#submit").on("click", () => {
            fetch('http://localhost:3000/api/delete/device', {
                method: "POST",
                body: JSON.stringify({ id: item.id }),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(async response => {
                const is_json = response.headers.get('content-type')?.includes('application/json');
                const data = is_json && await response.json();

                if (!response.ok)
                    return Promise.reject((data && data.message) || response.status);

                return popup.close();
            }).catch(error => {
                console.error('There was an error!', error);
            });
        });

        popup.open($html, 500, true);
    },
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Employee.List />} />
                    <Route path="/devices" element={<Device.List />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);