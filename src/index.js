import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the client package from react-dom
import App from './App.jsx';
import './index.css'; // Optional, if you have any styles

// Create a root for the app and render it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
