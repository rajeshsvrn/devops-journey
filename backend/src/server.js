// backend/src/server.js
const app = require('./app');
const config = require('./config/config');

const PORT = config.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${config.NODE_ENV}`);
    console.log(`🔗 Frontend URL: ${config.FRONTEND_URL}`);
});