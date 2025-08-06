import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/list/employees')
            .then((response) => response.json())
            .then((data) => setItems(data.employees));
    }, []);

    function setID(id, name, age) {
    }

    // Function to delete an entry
    function deleted(id) {

    }

    return (
        <div style={{ margin: "2rem" }}>
            <h1 className="text-center mb-4">User Management</h1>
            <Table striped bordered hover responsive className="shadow-sm">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Fullname</th>
                        <th>Role</th>
                        <th>Devices</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.employee_name}</td>
                                <td>{item.employee_role}</td>
                                <td>
                                    {item.devices.map((device, index) => {
                                        return (
                                            <b>{device.device_name}</b>
                                        )
                                    })}
                                </td>
                                <td>
                                    <Button
                                        onClick={() => setID(item.id, item.Name, item.Age)}
                                        variant="info"
                                        className="me-2">
                                        Update
                                    </Button>
                                    <Button
                                        onClick={() => deleted(item.id)}
                                        variant="danger">
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <div className="d-grid gap-2 mt-4">
                <Button variant="success" size="lg">
                    Create New User
                </Button>
            </div>
        </div>
    );
}

export default App;