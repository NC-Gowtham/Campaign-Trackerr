import React, { useState } from 'react';

export default function Login({ onLogin }){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function submit(e){
    e.preventDefault();
    setError(null);
    try{
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if(res.ok){
        onLogin(data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    }catch(err){
      setError('Network error. Is the backend running?');
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <label>Username</label>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="admin" />
      <label>Password</label>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
      <button type="submit">Login</button>
    </form>
  );
}