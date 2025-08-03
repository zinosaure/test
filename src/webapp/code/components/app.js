import React, { useEffect, useState } from 'react';

function App() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/items')
            .then((response) => response.json())
            .then((data) => setItems(data));
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Items</h1>
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>{item.name}</li>
                    ))}
                </ul>
            </header>
        </div >
    );
}

export default App;