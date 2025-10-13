import React, { useState } from 'react';

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        onSignup(data.token); // Pass the new token up to App.js
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      <label>Username</label>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" />
      <label>Password</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Choose a password" />
      <button type="submit">Sign Up</button>
    </form>
  );
}