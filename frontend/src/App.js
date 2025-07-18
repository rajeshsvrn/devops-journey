import React, { useState } from 'react';
import './App.css';

const API_URL = '/api';

function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/${isLogin ? 'login' : 'register'}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        const data = await res.json();
        if (res.ok) {
            setMessage(data.message);
            if (isLogin) setLoggedIn(true);
        } else {
            setMessage(data.message);
        }
    };

    if (loggedIn) return <h1>✅ Welcome to DevOps Journey</h1>;

    return (
        <div className="App">
            <h1>DevOps Journey with GitOps</h1>
            <form onSubmit={handleSubmit}>
                <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
                <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <p>{message}</p>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Switch to Register' : 'Switch to Login'}
            </button>
        </div>
    );
}

export default App;