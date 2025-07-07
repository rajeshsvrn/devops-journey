import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [health, setHealth] = useState(null);

  // Check backend health
  useEffect(() => {
    fetch(`${API_URL.replace('/api', '')}/health`)
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error('Health check failed:', err));
  }, []);

  // Load users if logged in
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/users`)
        .then(res => res.json())
        .then(data => setUsers(data.users || []))
        .catch(err => console.error('Failed to load users:', err));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    const payload = isLogin 
      ? { username: formData.username, password: formData.password }
      : formData;

    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setMessage(`${isLogin ? 'Login' : 'Registration'} successful!`);
        setFormData({ username: '', email: '', password: '' });
      } else {
        setMessage(data.message || 'Operation failed');
      }
    } catch (error) {
      setMessage('Network error: ' + error.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUsers([]);
    setMessage('Logged out successfully');
  };

  if (user) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>🚀 DevOps Journey</h1>
          <div className="welcome-section">
            <h2>Welcome, {user.username}!</h2>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
          
          <div className="users-section">
            <h3>Registered Users ({users.length})</h3>
            <div className="users-grid">
              {users.map(u => (
                <div key={u._id} className="user-card">
                  <strong>{u.username}</strong>
                  <span>{u.email}</span>
                  <small>{new Date(u.createdAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="system-status">
            <h3>System Status</h3>
            <div className="status-grid">
              <div className="status-item">
                <span>Frontend:</span>
                <span className="status-ok">✅ Running</span>
              </div>
              <div className="status-item">
                <span>Backend:</span>
                <span className={health ? "status-ok" : "status-error"}>
                  {health ? "✅ Connected" : "❌ Disconnected"}
                </span>
              </div>
              <div className="status-item">
                <span>Database:</span>
                <span className={health?.database === 'connected' ? "status-ok" : "status-error"}>
                  {health?.database === 'connected' ? "✅ Connected" : "❌ Disconnected"}
                </span>
              </div>
            </div>
            {health && (
              <p className="health-info">
                Environment: {health.environment} | Uptime: {Math.floor(Date.now() / 1000 - new Date(health.timestamp).getTime() / 1000)}s
              </p>
            )}
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 DevOps Journey</h1>
        <p>Three-Tier Application Demo</p>
        
        <div className="auth-container">
          <div className="auth-toggle">
            <button 
              className={isLogin ? 'active' : ''} 
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={!isLogin ? 'active' : ''} 
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
            {!isLogin && (
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            )}
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button type="submit">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          {message && (
            <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>

        <div className="demo-info">
          <h3>Demo Credentials</h3>
          <p>Create an account or use: <strong>demo / demo123</strong></p>
        </div>
      </header>
    </div>
  );
}

export default App;