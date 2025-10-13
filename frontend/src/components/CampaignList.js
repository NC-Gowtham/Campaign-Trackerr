import React, { useState, useMemo } from 'react';

export default function CampaignList({ campaigns, token, onUpdate, onDelete }){
  const [filter, setFilter] = useState('');

  async function updateStatus(id, status){
    try {
      const res = await fetch('/api/campaigns/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        const updatedCampaign = await res.json();
        onUpdate(updatedCampaign); 
      } else {
        console.error("Failed to update status");
      }
    } catch (err) {
      console.error("Network error updating status", err);
    }
  }

  async function deleteCampaign(id){
    if(!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const res = await fetch('/api/campaigns/' + id, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();

      if (res.ok) {
        onDelete(data.id); // Use the ID returned from the backend
      } else {
        console.error("Failed to delete campaign");
      }
    } catch (err)
      {
      console.error("Network error deleting campaign", err);
    }
  }

  const filteredCampaigns = useMemo(() => {
    if (!filter) return campaigns;
    const lowerFilter = filter.toLowerCase();
    return campaigns.filter(c => 
      c.name.toLowerCase().includes(lowerFilter) ||
      c.client.toLowerCase().includes(lowerFilter)
    );
  }, [campaigns, filter]);

  return (
    <div className="card">
      <h3>Campaigns</h3>
      <input 
        style={{width: '100%', boxSizing: 'border-box', marginBottom: '15px', padding: '10px'}}
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Search by name or client..."
      />
      <table className="campaign-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Client</th>
            <th>Start Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCampaigns.length === 0 && (
            <tr><td colSpan="5">
              {campaigns.length === 0 ? "No campaigns yet" : "No campaigns match filter"}
            </td></tr>
          )}
          {filteredCampaigns.map(c => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.client}</td>
              <td>{new Date(c.startDate).toLocaleDateString()}</td>
              <td>
                <select value={c.status} onChange={e => updateStatus(c._id, e.target.value)}>
                  <option>Active</option>
                  <option>Paused</option>
                  <option>Completed</option>
                </select>
              </td>
              <td>
                <button className="danger" onClick={() => deleteCampaign(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}