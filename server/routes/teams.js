const express = require('express');
const Team = require('../models/Team');
const User = require('../models/User');

const router = express.Router();

// Create a new team
router.post('/', async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) return res.status(400).json({ message: 'Team name and userId are required.' });
    const existing = await Team.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Team already exists.' });
    const team = new Team({ name, members: [userId] });
    await team.save();
    await User.findByIdAndUpdate(userId, { $push: { teams: team._id } });
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Join a team
router.post('/join', async (req, res) => {
  try {
    const { teamId, userId } = req.body;
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found.' });
    if (team.members.includes(userId)) return res.status(400).json({ message: 'Already a member.' });
    team.members.push(userId);
    await team.save();
    await User.findByIdAndUpdate(userId, { $push: { teams: team._id } });
    res.json({ message: 'Joined team.', team });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// List all teams for the user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId is required.' });
    const user = await User.findById(userId).populate('teams');
    res.json(user.teams);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 