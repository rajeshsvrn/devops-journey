// frontend/src/components/Home.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { healthCheck } from '../services/api';

const Home = () => {
    const { user, logout } = useAuth();
    const [healthStatus, setHealthStatus] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Check backend health status
        const checkHealth = async () => {
            try {
                const response = await healthCheck();
                setHealthStatus({
                    status: 'healthy',
                    data: response.data
                });
            } catch (error) {
                setHealthStatus({
                    status: 'unhealthy',
                    error: error.message
                });
            }
        };

        checkHealth();

        // Update current time every second
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Check health every 30 seconds
        const healthInterval = setInterval(checkHealth, 30000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(healthInterval);
        };
    }, []);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            logout();
        }
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };

    const getTimeOfDayGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="home-container">
            {/* Header */}
            <header className="home-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1>🚀 DevOps Journey</h1>
                        <p className="current-time">{formatDate(currentTime)}</p>
                    </div>
                    <div className="header-right">
                        <div className="user-menu">
                            <span className="user-greeting">
                                {getTimeOfDayGreeting()}, {user?.username}!
                            </span>
                            <button onClick={handleLogout} className="logout-button">
                                <span className="logout-icon">🚪</span>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="home-content">
                {/* Welcome Section */}
                <section className="welcome-section">
                    <div className="welcome-card">
                        <div className="welcome-header">
                            <h2>Welcome to Your DevOps Journey! 🎉</h2>
                            <p>You've successfully set up the foundation of a modern three-tier application.</p>
                        </div>

                        <div className="user-info">
                            <h3>👤 Your Profile</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Username:</span>
                                    <span className="info-value">{user?.username}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Email:</span>
                                    <span className="info-value">{user?.email}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Last Login:</span>
                                    <span className="info-value">
                                        {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Just now'}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Member Since:</span>
                                    <span className="info-value">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* System Status */}
                <section className="status-section">
                    <div className="status-card">
                        <h3>🔍 System Status</h3>
                        <div className="status-grid">
                            <div className="status-item">
                                <span className="status-label">Frontend:</span>
                                <span className="status-value healthy">
                                    <span className="status-dot"></span>
                                    Running
                                </span>
                            </div>
                            <div className="status-item">
                                <span className="status-label">Backend:</span>
                                <span className={`status-value ${healthStatus?.status === 'healthy' ? 'healthy' : 'unhealthy'}`}>
                                    <span className="status-dot"></span>
                                    {healthStatus?.status === 'healthy' ? 'Running' : 'Unhealthy'}
                                </span>
                            </div>
                            <div className="status-item">
                                <span className="status-label">Database:</span>
                                <span className={`status-value ${healthStatus?.status === 'healthy' ? 'healthy' : 'unhealthy'}`}>
                                    <span className="status-dot"></span>
                                    {healthStatus?.status === 'healthy' ? 'Connected' : 'Disconnected'}
                                </span>
                            </div>
                        </div>

                        {healthStatus?.data && (
                            <div className="health-details">
                                <h4>Backend Health Details:</h4>
                                <ul>
                                    <li>Environment: {healthStatus.data.environment}</li>
                                    <li>Uptime: {Math.floor(healthStatus.data.uptime / 60)} minutes</li>
                                    <li>Status: {healthStatus.data.status}</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </section>

                {/* Journey Progress */}
                <section className="progress-section">
                    <div className="progress-card">
                        <h3>🗺️ Your DevOps Journey Progress</h3>
                        <div className="progress-list">
                            <div className="progress-item completed">
                                <span className="progress-icon">✅</span>
                                <div className="progress-content">
                                    <h4>Local Development Setup</h4>
                                    <p>Three-tier application with React, Node.js, and MongoDB</p>
                                </div>
                            </div>

                            <div className="progress-item next">
                                <span className="progress-icon">⏳</span>
                                <div className="progress-content">
                                    <h4>Next: Containerization</h4>
                                    <p>Docker and Docker Compose setup</p>
                                </div>
                            </div>

                            <div className="progress-item upcoming">
                                <span className="progress-icon">🔄</span>
                                <div className="progress-content">
                                    <h4>Upcoming: CI/CD Pipeline</h4>
                                    <p>Azure DevOps implementation</p>
                                </div>
                            </div>

                            <div className="progress-item upcoming">
                                <span className="progress-icon">☸️</span>
                                <div className="progress-content">
                                    <h4>Upcoming: Kubernetes Deployment</h4>
                                    <p>Container orchestration and scaling</p>
                                </div>
                            </div>

                            <div className="progress-item upcoming">
                                <span className="progress-icon">📊</span>
                                <div className="progress-content">
                                    <h4>Upcoming: Monitoring & Observability</h4>
                                    <p>Prometheus, Grafana, and logging</p>
                                </div>
                            </div>

                            <div className="progress-item upcoming">
                                <span className="progress-icon">🔐</span>
                                <div className="progress-content">
                                    <h4>Upcoming: Security & Compliance</h4>
                                    <p>Security scanning and best practices</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="actions-section">
                    <div className="actions-card">
                        <h3>🚀 Quick Actions</h3>
                        <div className="actions-grid">
                            <button className="action-button" onClick={() => window.open('https://github.com/your-org/devops-journey', '_blank')}>
                                <span className="action-icon">📚</span>
                                View Documentation
                            </button>
                            <button className="action-button" onClick={() => window.open('/health', '_blank')}>
                                <span className="action-icon">🔍</span>
                                Check API Health
                            </button>
                            <button className="action-button" onClick={() => window.location.reload()}>
                                <span className="action-icon">🔄</span>
                                Refresh Status
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="home-footer">
                <div className="footer-content">
                    <p>&copy; 2024 DevOps Journey. Built with ❤️ for learning.</p>
                    <div className="tech-stack">
                        <span className="tech-item">React</span>
                        <span className="tech-item">Node.js</span>
                        <span className="tech-item">MongoDB</span>
                        <span className="tech-item">Express</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;