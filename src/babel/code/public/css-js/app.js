const bs = ReactBootstrap;

function App(html) {
    const header = (
        <div>
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
                        <a className="text-decoration-none text-dark" href="javascript:void(0)">
                            <i className="fa-solid fa-bars"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
    const items = [
        { title: "item-1" },
        { title: "item-2" },
    ];
    return (
        <div>
            <h1>
                Example heading
                <bs.Badge bg="secondary" as={bs.Button}>
                    New
                </bs.Badge>
            </h1>
        </div>
    );
    return (
        <div className="container">
            <header className="pt-3 mb-3">
                <div className="fs-3">
                    <Card html={header} />
                </div>
            </header>
            <div className="row">
                <div className="col-3">
                    <Sidebar items={items} />
                </div>
                <div className="col-9">
                    {html}
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
        <div>
            {props.title}
        </div>
    )
}

function Card(props) {
    return (
        <div className="card">
            <div className="card-body">
                {props.html}
            </div>
        </div>
    );
}


function Input(props) {
    const { value, handleOnChange } = props;
    return (
        <input value={value} onChange={(e) => handleOnChange(e.target.value)} />
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

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(App(<Form />));