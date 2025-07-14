// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import './index.css';


// import './jaeger-tracing'; // Import the tracing configuration

// // Rest of your app initialization
// ReactDOM.render(<App />, document.getElementById('root'));

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './jaeger-tracing'; // Import the tracing configuration

// Modern React 18+ rendering (correct way)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);