import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';


import '../jaeger-tracing'; // Import the tracing configuration

// Rest of your app initialization
ReactDOM.render(<App />, document.getElementById('root'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import './index.css';
// import { initTracer } from 'jaeger-client';

// // Initialize Jaeger tracer
// const tracer = initTracer({
//     serviceName: process.env.REACT_APP_JAEGER_SERVICE_NAME || 'frontend-service',
//     sampler: {
//         type: process.env.REACT_APP_JAEGER_SAMPLER_TYPE || 'const',
//         param: parseFloat(process.env.REACT_APP_JAEGER_SAMPLER_PARAM || '1'),
//     },
//     reporter: {
//         agentHost: process.env.REACT_APP_JAEGER_AGENT_HOST || 'jaeger-agent.monitoring',
//         agentPort: process.env.REACT_APP_JAEGER_AGENT_PORT
//             ? parseInt(process.env.REACT_APP_JAEGER_AGENT_PORT)
//             : 6831,
//     },
// });

// // Instrument fetch API
// const originalFetch = window.fetch;
// window.fetch = (url, options = {}) => {
//     const span = tracer.startSpan(`fetch:${url}`);
//     span.setTag('http.url', url);

//     // Inject tracing headers
//     const headers = options.headers || {};
//     tracer.inject(span, jaeger.FORMAT_HTTP_HEADERS, headers);

//     return originalFetch(url, { ...options, headers })
//         .then(response => {
//             span.setTag('http.status_code', response.status);
//             span.finish();
//             return response;
//         })
//         .catch(error => {
//             span.setTag('error', true);
//             span.log({ event: 'error', message: error.message });
//             span.finish();
//             throw error;
//         });
// };

// // Trace React component mounts
// const originalCreateRoot = ReactDOM.createRoot;
// ReactDOM.createRoot = (container, options) => {
//     const root = originalCreateRoot(container, options);

//     const originalRender = root.render;
//     root.render = (element) => {
//         const span = tracer.startSpan('react.mount');
//         span.log({ event: 'mounting_app' });

//         try {
//             return originalRender.call(root, element);
//         } finally {
//             span.finish();
//         }
//     };

//     return root;
// };

// // Render app with tracing
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>
// );

// // Trace initial page load
// const pageLoadSpan = tracer.startSpan('page.load');
// pageLoadSpan.log({ event: 'initial_load' });
// window.addEventListener('load', () => {
//     pageLoadSpan.finish();
// });