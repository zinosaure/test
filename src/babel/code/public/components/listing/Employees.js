

function RouteEmployees() {
    return <App
        title={"List of employees"}
        content={<ListEmployees />}
    />;
}

function ListEmployees() {
    return <Table
        labels={{
            '<i class="fa-solid fa-pencil"></i>':
                () => `<a onclick="edit_employee(this)" href="javascript:void(0)"><i class="fa-solid fa-pencil"></i></a>`,
            "Fullname": "employee_name",
            "Role": "employee_role",
            '<i class="fa-solid fa-trash"></i>':
                () => `<a onclick="delete_employee(this)" href="javascript:void(0)"><i class="fa-solid fa-trash"></i></a>`,
        }}
        endpoint={"http://localhost:3000/api/list/employees"}
        callback={(data, setItems, setTotalItem) => {
            setTimeout(() => {
                setItems(data.employees);
                setTotalItem(data.meta.total_items);
            }, 2000);
        }}
        push_item_callback={edit_employee}
    />
}

function up() {
    RouteEmployees().update_content(<EditEmployee />);
}

function EditEmployee({item}) {
    return (<div>
        <h4>Add an employee in the database ?</h4>
        <hr />
        <bs.Form>
            <bs.Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <bs.Form.Label>Email address</bs.Form.Label>
                <bs.Form.Control type="email" placeholder="name@example.com" />
            </bs.Form.Group>
            <bs.Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <bs.Form.Label>Example textarea</bs.Form.Label>
                <bs.Form.Control as="textarea" rows={3} value={item.employee_name} />
            </bs.Form.Group>
        </bs.Form>
        <hr />
        <bs.Row>
            <bs.Col></bs.Col>
            <bs.Col></bs.Col>
            <bs.Col>
                <bs.Button
                    id="cancel-delete"
                    type="button"
                    variant="outline-secondary"
                    className="w-100"
                >No</bs.Button>
            </bs.Col>
            <bs.Col>
                <bs.Button
                    id="confirm-delete"
                    type="button"
                    variant="warning"
                    className="w-100"
                >Yes</bs.Button>
            </bs.Col>
        </bs.Row>
    </div>);
}

function DeleteEmployee() {
    return (<div>
        <h4>Remove this employee in the database ?</h4>
        <hr />
        <bs.Row>
            <bs.Col></bs.Col>
            <bs.Col></bs.Col>
            <bs.Col>
                <bs.Button
                    id="cancel-delete"
                    type="button"
                    variant="outline-secondary"
                    className="w-100"
                >No</bs.Button>
            </bs.Col>
            <bs.Col>
                <bs.Button
                    id="confirm-delete"
                    type="button"
                    variant="warning"
                    className="w-100"
                >Yes</bs.Button>
            </bs.Col>
        </bs.Row>
    </div>);
}

function edit_employee(button) {
    return popup.open(renderToString(<EditEmployee item={$(button).closest("tr").data("item") || {}} />), 500, true);
}


function delete_employee(button) {
    const item = $(button).closest("tr").data("item") || {};
    const $html = renderToString(<DeleteEmployee />);

    $html.find("#cancel-delete").on("click", () => popup.close());
    $html.find("#confirm-delete").on("click", () => {
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

            refresh_app(<ListEmployees />);

            return popup.close();
        }).catch(error => {
            console.error('There was an error!', error);
        });
    });

    popup.open($html, 500, true);
}