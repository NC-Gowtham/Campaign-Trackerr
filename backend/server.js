const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('./authMiddleware');

// --- Config ---
const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-me';

const USERS_FILE = path.join(__dirname, 'users.json');
const CAMPAIGNS_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

function readJson(file) {
  try {
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading', file, err);
    return [];
  }
}

function writeJson(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing', file, err);
  }
}

// --- Auth Routes (file-backed) ---
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

    const users = readJson(USERS_FILE);
    if (users.find(u => u.username === username)) return res.status(400).json({ error: 'Username already taken' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = Date.now().toString();
    const newUser = { _id: id, username, password: hashedPassword };
    users.push(newUser);
    writeJson(USERS_FILE, users);

    const token = jwt.sign({ username: newUser.username, id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = readJson(USERS_FILE);
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ username: user.username, id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});


// --- Protected Campaign Routes (file-backed) ---
app.use('/api/campaigns', authMiddleware);

app.get('/api/campaigns', (req, res) => {
  try {
    const campaigns = readJson(CAMPAIGNS_FILE);
    // Only return campaigns belonging to this user
    const result = campaigns.filter(c => c.user === req.user.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching campaigns' });
  }
});

app.post('/api/campaigns', (req, res) => {
  try {
    const { name, client, startDate, status } = req.body;
    if (!name || !client || !startDate) return res.status(400).json({ error: 'Missing required fields' });

    const campaigns = readJson(CAMPAIGNS_FILE);
    const id = Date.now().toString();
    const newCampaign = { _id: id, name, client, startDate, status: status || 'Active', user: req.user.id };
    campaigns.push(newCampaign);
    writeJson(CAMPAIGNS_FILE, campaigns);
    res.status(201).json(newCampaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating campaign' });
  }
});

app.put('/api/campaigns/:id', (req, res) => {
  try {
    const { status } = req.body;
    const campaigns = readJson(CAMPAIGNS_FILE);
    const idx = campaigns.findIndex(c => c._id === req.params.id && c.user === req.user.id);
    if (idx === -1) return res.status(404).json({ error: 'Campaign not found or user not authorized' });
    campaigns[idx].status = status;
    writeJson(CAMPAIGNS_FILE, campaigns);
    res.json(campaigns[idx]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating campaign' });
  }
});

app.delete('/api/campaigns/:id', (req, res) => {
  try {
    const campaigns = readJson(CAMPAIGNS_FILE);
    const idx = campaigns.findIndex(c => c._id === req.params.id && c.user === req.user.id);
    if (idx === -1) return res.status(404).json({ error: 'Campaign not found or user not authorized' });
    const deleted = campaigns.splice(idx, 1)[0];
    writeJson(CAMPAIGNS_FILE, campaigns);
    res.status(200).json({ message: 'Campaign deleted', id: deleted._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting campaign' });
  }
});


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend server (file-backed) running on http://localhost:${PORT}`);
});