const bs = ReactBootstrap;

function App({title, content}) {
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
                                    <bs.Nav.Link href="/home">Active</bs.Nav.Link>
                                    <bs.Nav.Link eventKey="link-1">Link</bs.Nav.Link>
                                </bs.Nav>
                            </bs.Card.Body>
                        </bs.Card>
                    </bs.Col>
                    <bs.Col>
                        <bs.Card>
                            <bs.Card.Body>
                                <h1>{title}</h1>
                                <hr />
                                <div id="app-content">
                                    {content}
                                </div>
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
                                    Signed in as: <a href="#login">Mark Otto</a>
                                </bs.Navbar.Text>
                            </bs.Col>
                        </bs.Row>
                    </bs.Card.Body>
                </bs.Card>
            </bs.Container>
        </>
    );
}





function refresh_app(component) {
    ReactDOM.hydrateRoot(document.querySelector('#app-content'), component);
}

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<RouteEmployees />);