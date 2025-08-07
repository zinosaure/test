const bs = ReactBootstrap;




function App(content) {
    const items = [
        { title: "item-1" },
        { title: "item-2" },
    ];

    return (
        <div className="container">
            <header className="pt-3 mb-3">
                <div className="fs-3">
                    <bs.Card>
                        <bs.Card.Body>
                            <div className="row">
                                <div className="col-5">
                                    <a href="/?ref=logo">
                                        <img className="logo" src="/public/images/fleet.png" />
                                    </a>
                                </div>
                                <div className="col-7">
                                    <div className="text-end">
                                        <a className="text-decoration-none text-dark me-3" href="/">
                                            <i className="fa-solid fa-envelope"></i>
                                        </a>
                                        <i className="fa-solid fa-bell me-3"></i>
                                        <a className="text-decoration-none text-dark">
                                            <i className="fa-solid fa-bars"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </bs.Card.Body>
                    </bs.Card>
                </div>
            </header>
            <div className="row">
                <div className="col-3">
                    <bs.Card>
                        <bs.Card.Body>
                            <Sidebar items={items} />
                        </bs.Card.Body>
                    </bs.Card>
                </div>
                <div className="col-9">
                    <bs.Card>
                        <bs.Card.Body>
                            {content}
                        </bs.Card.Body>
                    </bs.Card>
                </div>
            </div>
        </div>
    );
}

function Sidebar(props) {
    const { items } = props

    return (
        <div className="sidebar">
            <div className="sidebar-items">
                {items.map(({ title }, index) => (
                    <MenuItem key={index} title={title} />
                ))}
            </div>
        </div>
    )
}

function MenuItem(props) {
    return (
        <>
            <bs.Card>
                <bs.Card.Body>
                    {props.title}
                </bs.Card.Body>
            </bs.Card>
        </>
    )
}


function Input(props) {
    const { value, handleOnChange } = props;

    return (
        <input value={value} onChange={(e) => handleOnChange(e.target.value)} />
    );
}

function Table({ labels, endpoint, callback, delete_callback }) {
    const [items, setItems] = React.useState([]);

    React.useEffect(() => {
        fetch(endpoint)
            .then((response) => response.json())
            .then((data) => callback ? setItems(callback(data)) : setItems(data));
    }, []);

    const handle_callback = (callback, item) => {
        if (typeof callback == "function")
            return callback(item);

        if (callback in item)
            return item[callback];

        return callback;
    }

    return (
        <bs.Table striped bordered hover responsive>
            <thead key="thead">
                <tr key="0">
                    {Object.keys(labels).map((label, i) => {
                        return (<th key={i} dangerouslySetInnerHTML={{ __html: label }} />);
                    })}
                </tr>
            </thead>
            <tbody key="tbody">
                {items.map((item, i) => {
                    return (
                        <tr key={i} data-item={JSON.stringify(item)}>
                            {Object.values(labels).map((callback, j) => {
                                return (<td key={j} dangerouslySetInnerHTML={{ __html: handle_callback(callback, item) }} />);
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </bs.Table>
    );
}

class Form extends React.Component {
    state = {
        name: '',
        email: '',
        message: '',
    }

    onChange(e) {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer my-token',
                'My-Custom-Header': 'foobar'
            },
            body: JSON.stringify(this.state)
        };
        fetch('https://reqres.in/invalid-url', requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    return Promise.reject((data && data.message) || response.status);
                }

                this.setState({ postId: data.id })
            })
            .catch(error => {
                this.setState({ errorMessage: error });
                console.error('There was an error!', error);
            });
    }


    componentDidMount() {
        // POST request using fetch with set headers
        // const requestOptions = {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer my-token',
        //         'My-Custom-Header': 'foobar'
        //     },
        //     body: JSON.stringify(this.state)
        // };
        // fetch('https://reqres.in/invalid-url', requestOptions)
        //     .then(async response => {
        //         const isJson = response.headers.get('content-type')?.includes('application/json');
        //         const data = isJson && await response.json();

        //         // check for error response
        //         if (!response.ok) {
        //             // get error message from body or default to response status
        //             return Promise.reject((data && data.message) || response.status);
        //         }

        //         this.setState({ postId: data.id })
        //     })
        //     .catch(error => {
        //         this.setState({ errorMessage: error });
        //         console.error('There was an error!', error);
        //     });
    }

    render() {
        return <form onSubmit={e => this.onSubmit(e)}>
            <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                value={this.state.name}
                onChange={e => this.onChange(e)}
            />
            <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={this.state.email}
                onChange={e => this.onChange(e)}
            />
            <textarea
                name="message"
                placeholder="Enter your message"
                value={this.state.message}
                onChange={e => this.onChange(e)}
            />
            <button type="submit">Submit</button>
        </form>;
    }
}


function Signin({ item }) {
    return (
        <bs.Form>
            <bs.Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <bs.Form.Label>Email address</bs.Form.Label>
                <bs.Form.Control type="email" placeholder="name@example.com" />
            </bs.Form.Group>
            <bs.Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <bs.Form.Label>Example textarea</bs.Form.Label>
                <bs.Form.Control as="textarea" rows={3} value={item.name.first} />
            </bs.Form.Group>
        </bs.Form>
    );
}

function Edit() {
    return (<></>);
}

function Delete() {
    return (<div>
        <h4>Do you want to delete this line ?</h4>
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


function renderToString(component) {
    const div = document.createElement("div");

    ReactDOM.flushSync(() => {
        ReactDOM.createRoot(div).render(component);
    });

    return $(div.innerHTML);
}


function edit_line(button) {
    return popup.open(renderToString(<Signin item={$(button).closest("tr").data("item") || {}} />), 400, true);
}


function delete_line(button) {
    const item = $(button).closest("tr").data("item") || {};
    const $html = renderToString(<Delete />);

    $html.find("#cancel-delete").on("click", () => popup.close());
    $html.find("#confirm-delete").on("click", () => {
        fetch('http://localhost:3000/api/delete/employee', {
            method: "POST",
            body: JSON.stringify({ id: item.id }),
            headers: {
                "Content-Type": "application/json",
                // 'Authorization': 'Bearer my-token',
            },
        }).then(async response => {
            const is_json = response.headers.get('content-type')?.includes('application/json');
            const data = is_json && await response.json();

            if (!response.ok)
                return Promise.reject((data && data.message) || response.status);

            $(button).closest("tr").remove();

            return popup.close();
        }).catch(error => {
            console.error('There was an error!', error);
        });
    });

    popup.open($html, 500, true);
}




ReactDOM.createRoot(document.querySelector('#app')).render(App(
    <Table
        labels={{
            '<i class="fa-solid fa-pencil"></i>':
                () => `<a onClick="edit_line(this)"><i class="fa-solid fa-pencil"></i></a>`,
            "Fullname": "employee_name",
            "Role": "employee_role",
            '<i class="fa-solid fa-trash"></i>':
                () => `<a onclick="delete_line(this)"><i class="fa-solid fa-trash"></i></a>`,
        }}
        endpoint={"http://localhost:3000/api/list/employees"}
        callback={(data) => data.employees}
    />
));