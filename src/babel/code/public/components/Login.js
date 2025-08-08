function Login({ item }) {
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