import React, { useState } from 'react';
import { BASE_URL } from '../config';

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        onSignup(data.token);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    }
  }

  return (
    <div className="auth-wrapper">
      <form className="card auth-card" onSubmit={submit}>
        <h2 style={{ margin: 0, marginBottom: 8, color: 'var(--muted)' }}>Create account</h2>
        {error && <div className="error">{error}</div>}
        <label>Username</label>
        <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" />
        <label>Password</label>
        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Choose a password" />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 6 }}>
          <button className="btn primary" type="submit">Sign Up</button>
          <div style={{ flex: 1 }} />
        </div>
      </form>
    </div>
  );
}
