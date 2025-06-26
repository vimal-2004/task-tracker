const express = require('express');
const Task = require('../models/Task');
const Team = require('../models/Team');

const router = express.Router();

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, team, assignedTo, dueDate, userId } = req.body;
    if (!title || !team || !userId) return res.status(400).json({ message: 'Title, team, and userId are required.' });
    // Check if user is in the team
    const teamDoc = await Team.findById(team);
    if (!teamDoc || !teamDoc.members.includes(userId)) {
      return res.status(403).json({ message: 'Not a member of the team.' });
    }
    const task = new Task({
      title,
      description,
      team,
      assignedTo,
      dueDate,
      createdBy: userId,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// List all tasks for a team
router.get('/team/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const tasks = await Task.find({ team: teamId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 