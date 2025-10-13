const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose'); // <-- Import mongoose
const authMiddleware = require('./authMiddleware');

// --- Import Mongoose Models ---
const User = require('./models/User');
const Campaign = require('./models/Campaign');

// --- Config ---
const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-me';

// !!! PASTE YOUR ATLAS CONNECTION STRING HERE !!!
const MONGO_URI = "mongodb+srv://gowthamnc10_db_user:Gowtham123@cluster0.atgqsxt.mongodb.net/campaignTrackerDB?retryWrites=true&w=majority";

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Connect to MongoDB Atlas ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));


// --- Auth Routes (Now Async) ---

app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    // Save the new user to the database
    await newUser.save();

    // Create a token
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

    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // ▼▼▼ THIS LINE WAS FIXED ▼▼▼
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Success! Create a token.
    const token = jwt.sign({ username: user.username, id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});


// --- Protected Campaign Routes ---
app.use('/api/campaigns', authMiddleware);

// GET all campaigns (for the logged-in user)
app.get('/api/campaigns', async (req, res) => {
  try {
    // req.user.id comes from the authMiddleware
    const campaigns = await Campaign.find({ user: req.user.id });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching campaigns' });
  }
});

// POST a new campaign
app.post('/api/campaigns', async (req, res) => {
  try {
    const { name, client, startDate, status } = req.body;

    if (!name || !client || !startDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newCampaign = new Campaign({
      name,
      client,
      startDate,
      status,
      user: req.user.id // Assign to the logged-in user
    });

    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (err) {
    res.status(500).json({ error: 'Server error creating campaign' });
  }
});

// PUT (update) a campaign
app.put('/api/campaigns/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Find *and* update the campaign.
    // The { user: req.user.id } ensures a user can ONLY update their own campaign.
    const updatedCampaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true } // This returns the *updated* document
    );

    if (!updatedCampaign) {
      return res.status(404).json({ error: 'Campaign not found or user not authorized' });
    }
    
    res.json(updatedCampaign);
  } catch (err) {
    res.status(500).json({ error: 'Server error updating campaign' });
  }
});

// DELETE a campaign
app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    // Find *and* delete the campaign.
    // The { user: req.user.id } ensures a user can ONLY delete their own campaign.
    const deletedCampaign = await Campaign.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deletedCampaign) {
      return res.status(404).json({ error: 'Campaign not found or user not authorized' });
    }

    // Send back the ID of what was deleted, just like your frontend expects
    res.status(200).json({ message: 'Campaign deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting campaign' });
  }
});


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});