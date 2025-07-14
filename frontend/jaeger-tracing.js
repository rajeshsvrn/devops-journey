// jaeger-tracing.js
import { initTracer } from 'jaeger-client';

const config = {
  serviceName: process.env.JAEGER_SERVICE_NAME || 'frontend-service',
  sampler: {
    type: process.env.JAEGER_SAMPLER_TYPE || 'const',
    param: parseFloat(process.env.JAEGER_SAMPLER_PARAM || '1'),
  },
  reporter: {
    agentHost: process.env.JAEGER_AGENT_HOST || 'localhost',
    agentPort: process.env.JAEGER_AGENT_PORT ? 
      parseInt(process.env.JAEGER_AGENT_PORT) : 6831,
  },
};

const options = {
  tags: {
    'frontend.version': process.env.REACT_APP_VERSION || '1.0',
  },
  logger: console,
};

export const tracer = initTracer(config, options);

// Wrap fetch API to automatically trace requests
const originalFetch = window.fetch;
window.fetch = (url, options = {}) => {
  const span = tracer.startSpan(`fetch:${url}`);
  tracer.inject(span, FORMAT_HTTP_HEADERS, options.headers || {});

  return originalFetch(url, options)
    .then(response => {
      span.finish();
      return response;
    })
    .catch(error => {
      span.setTag('error', true);
      span.log({ event: 'error', message: error.message });
      span.finish();
      throw error;
    });
};