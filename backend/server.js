// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const User = require('./models/User');

// const app = express();
// const PORT = 5000;

// // Connect to MongoDB
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@mongodb:27017/devops-journey?authSource=admin';

// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error('❌ MongoDB connection error:', err));

// app.use(cors());
// app.use(express.json());

// // Health check
// app.get('/api/health', async (req, res) => {
//   const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
//   res.json({ status: 'ok', timestamp: new Date().toISOString(), database: dbStatus });
// });

// // Register
// app.post('/api/register', async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     const exists = await User.findOne({ username });
//     if (exists) return res.status(400).json({ message: 'User already exists' });

//     const newUser = new User({ username, email, password });
//     await newUser.save();
//     res.status(201).json({ user: newUser });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Login
// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username });
//     if (!user || user.password !== password)
//       return res.status(401).json({ message: 'Invalid credentials' });

//     res.json({ user });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // List users
// app.get('/api/users', async (req, res) => {
//   try {
//     const users = await User.find().sort({ createdAt: -1 });
//     res.json({ users });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jaeger = require('jaeger-client');
const { initTracer } = require('jaeger-client');
const User = require('./models/User');

// Initialize Jaeger tracer
const tracer = initTracer({
  serviceName: process.env.JAEGER_SERVICE_NAME || 'backend-service',
  sampler: {
    type: process.env.JAEGER_SAMPLER_TYPE || 'const',
    param: parseFloat(process.env.JAEGER_SAMPLER_PARAM || '1'),
  },
  reporter: {
    agentHost: process.env.JAEGER_AGENT_HOST || 'jaeger-agent.monitoring',
    agentPort: process.env.JAEGER_AGENT_PORT ?
      parseInt(process.env.JAEGER_AGENT_PORT) : 6831,
  },
});

// MongoDB query tracing
mongoose.set('debug', (collectionName, method, query, doc) => {
  const span = tracer.startSpan('mongoose.query');
  span.setTag('db.collection', collectionName);
  span.setTag('db.method', method);
  span.log({
    query: JSON.stringify(query),
    doc: JSON.stringify(doc)
  });
  span.finish();
});

const app = express();
const PORT = 5000;

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@mongodb:27017/devops-journey?authSource=admin';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
  // Trace connection event
  const span = tracer.startSpan('mongodb.connection');
  span.setTag('status', 'connected');
  span.finish();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  const span = tracer.startSpan('mongodb.connection');
  span.setTag('error', true);
  span.log({ event: 'error', message: err.message });
  span.finish();
});

// Tracing middleware
app.use((req, res, next) => {
  const span = tracer.startSpan(req.path);
  span.setTag('http.method', req.method);
  span.setTag('http.url', req.url);

  // Store span in request for route handlers
  req.span = span;

  res.on('finish', () => {
    span.setTag('http.status_code', res.statusCode);
    span.finish();
  });

  next();
});

app.use(cors());
app.use(express.json());

// Health check with tracing
app.get('/api/health', async (req, res) => {
  const span = tracer.startSpan('health_check', { childOf: req.span });
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    span.log({ event: 'db_check', status: dbStatus });
    res.json({ status: 'ok', timestamp: new Date().toISOString(), database: dbStatus });
  } finally {
    span.finish();
  }
});

// Register with tracing
app.post('/api/register', async (req, res) => {
  const span = tracer.startSpan('user_registration', { childOf: req.span });
  const { username, email, password } = req.body;

  try {
    span.log({ event: 'check_existing_user' });
    const exists = await User.findOne({ username });

    if (exists) {
      span.setTag('error', true);
      span.log({ event: 'user_exists' });
      return res.status(400).json({ message: 'User already exists' });
    }

    span.log({ event: 'create_user' });
    const newUser = new User({ username, email, password });
    await newUser.save();

    span.log({ event: 'user_created', userId: newUser._id });
    res.status(201).json({ user: newUser });
  } catch (err) {
    span.setTag('error', true);
    span.log({ event: 'error', message: err.message });
    res.status(500).json({ message: 'Server error' });
  } finally {
    span.finish();
  }
});

// Login with tracing
app.post('/api/login', async (req, res) => {
  const span = tracer.startSpan('user_login', { childOf: req.span });
  const { username, password } = req.body;

  try {
    span.log({ event: 'find_user' });
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      span.setTag('auth.failed', true);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    span.log({ event: 'login_success', userId: user._id });
    res.json({ user });
  } catch (err) {
    span.setTag('error', true);
    span.log({ event: 'error', message: err.message });
    res.status(500).json({ message: 'Server error' });
  } finally {
    span.finish();
  }
});

// List users with tracing
app.get('/api/users', async (req, res) => {
  const span = tracer.startSpan('list_users', { childOf: req.span });

  try {
    span.log({ event: 'fetch_users' });
    const users = await User.find().sort({ createdAt: -1 });

    span.log({ event: 'users_fetched', count: users.length });
    res.json({ users });
  } catch (err) {
    span.setTag('error', true);
    span.log({ event: 'error', message: err.message });
    res.status(500).json({ message: 'Server error' });
  } finally {
    span.finish();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  // Trace server startup
  const span = tracer.startSpan('server.startup');
  span.log({ event: 'server_started', port: PORT });
  span.finish();
});
