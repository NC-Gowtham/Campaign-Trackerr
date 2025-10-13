import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup"; // <-- 1. Import Signup
import CampaignForm from "./components/CampaignForm";
import CampaignList from "./components/CampaignList";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [campaigns, setCampaigns] = useState([]);
  const [view, setView] = useState("login"); // <-- 2. Add view state

  useEffect(() => {
    if (token) {
      fetch("/api/campaigns", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) {
            handleLogout(); // Log out if token is invalid/expired
            return;
          }
          return res.json();
        })
        .then(data => {
          if (data) setCampaigns(data);
        })
        .catch(console.error);
    }
  }, [token]);

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setCampaigns([]);
    setView("login"); // <-- 3. Reset view on logout
  }

  function handleLogin(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  return (
    <div className="container">
      <h1>Campaign Tracker</h1>

      {/* --- 4. This is the main updated section --- */}
      {!token ? (
        view === "login" ? (
          <>
            <Login onLogin={handleLogin} />
            <p style={{ textAlign: 'center', marginTop: '10px' }}>
              Don’t have an account?{" "}
              <button style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0 }} onClick={() => setView("signup")}>
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            <Signup onSignup={handleLogin} /> {/* onSignup can just call handleLogin */}
            <p style={{ textAlign: 'center', marginTop: '10px' }}>
              Already have an account?{" "}
              <button style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0 }} onClick={() => setView("login")}>
                Login
              </button>
            </p>
          </>
        )
      ) : (
        // This 'logged in' part remains the same
        <>
          <button onClick={handleLogout}>Logout</button>
          <Dashboard campaigns={campaigns} />
          <CampaignForm
            token={token}
            onAdd={(newCampaign) => setCampaigns([...campaigns, newCampaign])}
          />
          <CampaignList
            campaigns={campaigns}
            token={token}
            onUpdate={(updated) =>
              setCampaigns(
                campaigns.map((c) => (c._id === updated._id ? updated : c))
              )
            }
            onDelete={(id) =>
              setCampaigns(campaigns.filter((c) => c._id !== id))
            }
          />
        </>
      )}
    </div>
  );
}