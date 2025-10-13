const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  // Link to the user who created it
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  client: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Paused', 'Completed'],
    default: 'Active'
  }
});

module.exports = mongoose.model('Campaign', CampaignSchema);