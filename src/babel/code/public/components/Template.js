const bs = ReactBootstrap;


function renderToString(component) {
    const div = document.createElement("div");

    ReactDOM.flushSync(() => ReactDOM.createRoot(div).render(component));

    return div.innerHTML;
}


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