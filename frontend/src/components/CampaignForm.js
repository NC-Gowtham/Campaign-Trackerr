import React, { useState } from 'react';

export default function CampaignForm({ onAdd, token }){
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [startDate, setStartDate] = useState('');
  const [status, setStatus] = useState('Active');
  const [msg, setMsg] = useState(null);

  async function submit(e){
    e.preventDefault();
    setMsg(null);
    if(!name || !client || !startDate) {
      setMsg({ type: 'error', text: 'Please fill all required fields' });
      return;
    }
    try{
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name, client, startDate, status })
      });

      const data = await res.json(); 

      if(res.ok){
        setName(''); setClient(''); setStartDate(''); setStatus('Active');
        onAdd(data); 
        setMsg({ type: 'hint', text: 'Campaign added' });
      } else {
        setMsg({ type: 'error', text: data.error || 'Error adding campaign' });
      }
    }catch(err){
      setMsg({ type: 'error', text: 'Network error' });
    }
  }

  return (
    <form className="card small" onSubmit={submit}>
      <h3>Add Campaign</h3>
      {msg && <div className={msg.type}>{msg.text}</div>}
      <label>Campaign Name</label>
      <input value={name} onChange={e=>setName(e.target.value)} />
      <label>Client Name</label>
      <input value={client} onChange={e=>setClient(e.target.value)} />
      <label>Start Date</label>
      <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
      <label>Status</label>
      <select value={status} onChange={e=>setStatus(e.target.value)}>
        <option>Active</option>
        <option>Paused</option>
        <option>Completed</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
}