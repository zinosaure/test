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

function Table({ labels, endpoint, callback }) {
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
                        <tr key={i}>
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
function t() {
    const [html, setHTML] = React.useState({ __html: "" });

    React.useEffect(() => {
        (async () => {
            return { __html: await (await fetch("/api")).text() };
        })().then(html => setHTML(html))
    }, []);

    return html;
}

function Signin() {
    return (
        <div className="container">
            <form className="form-signin">
                <h2 className="form-signin-heading"> Please sign in </h2>
                <br />
                <label htmlFor="inputEmail" className="sr-only"> Email address
                </label>
                <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus />
                <br />
                <label htmlFor="inputPassword" className="sr-only"> Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" required />
                <br />
                <button className="btn btn-lg btn-primary btn-block" type="button"> Sign in
                </button>
            </form>
        </div>
    )
}

function Edit() {
    return (<></>);
}

function Delete() {
    return (<></>);
}

function a() {
    const div = document.createElement("div");
    const root = ReactDOM.createRoot(div);
    ReactDOM.flushSync(() => root.render(<Signin />));

    return popup.open(div.innerHTML);
}


ReactDOM.createRoot(document.querySelector('#app')).render(App(
    <Table
        labels={{
            "Fullname": (item) => `${item.name.last} ${item.name.first}`,
            "Email": "email",
            '<i class="fa-solid fa-pencil"></i>': (item) => `<a onClick="a()"><i class="fa-solid fa-pencil"></i></a>`,
            '<i class="fa-solid fa-trash"></i>': (item) => `<a onClick=""><i class="fa-solid fa-trash"></i></a>`,
        }}
        endpoint={"https://randomuser.me/api/?results=20"}
        callback={(data) => data.results}
    />
));