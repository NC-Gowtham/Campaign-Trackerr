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
    <div className="auth-wrapper">
      <form className="card auth-card" onSubmit={submit}>
        <h2 style={{margin:0, marginBottom:8, background: 'transparent', backgroundClip: 'text', color: 'transparent', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(90deg,#6a11cb,#2575fc)'}}>Welcome back</h2>
        <p style={{marginTop:0, marginBottom:12, color:'var(--muted)'}}>Sign in to manage your campaigns</p>
        {error && <div className="error">{error}</div>}
        <label>Username</label>
        <input className="input" value={username} onChange={e=>setUsername(e.target.value)} placeholder="your username" />
        <label>Password</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="your password" />
        <div style={{display:'flex', gap:10, alignItems:'center', marginTop:6}}>
          <button className="btn primary" type="submit">Login</button>
          <div style={{flex:1}} />
        </div>
      </form>
    </div>
  );
}