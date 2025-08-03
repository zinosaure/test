'use strict';

import './public/css-js/app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);