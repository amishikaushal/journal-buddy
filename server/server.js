import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import Entry from './models/Entry.js';
import User from './models/User.js';
import geminiResponse from './geminiService.js';
import authMiddleware from './middleware/authMiddleware.js';
import { chatResponse } from './geminiService.js';
import { startReminderService } from './services/reminderService.js';



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start the reminder service
startReminderService();

app.post('/api/assistant/chat', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const response = await chatResponse(message);
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

app.get("/api/mood", async (req, res) => {
  try {
    const prompt = req.query.prompt;
    const data = await geminiResponse(prompt);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error analyzing mood' });
  }
});

app.get('/api/journal', authMiddleware, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching entries' });
  }
});

app.post('/api/journal', authMiddleware, async (req, res) => {
  try {
    const entry = new Entry({ ...req.body, user: req.user._id });
    const savedEntry = await entry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(500).json({ error: 'Error creating entry' });
  }
});

app.delete('/api/journal/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ error: 'Entry not found or unauthorized' });

    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting entry' });
  }
});






app.get('/api/journal/analytics', authMiddleware, async (req, res) => {
  try {
    // Fetch all entries for the user
    const entries = await Entry.find({ user: req.user._id }).sort({ createdAt: 1 });

    // Process mood history - change sentiment to sentimentScore
    const moodHistory = entries.map(entry => ({
      date: entry.createdAt.toLocaleDateString(),
      sentimentScore: entry.sentimentScore || 0  // Changed from sentiment to sentimentScore
    }));

    // Process tag cloud
    const words = entries
      .map(entry => entry.content.toLowerCase())
      .join(' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const tagCloud = Object.entries(wordCount)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);

    res.json({
      moodHistory,
      tagCloud
    });
  } catch (error) {
    console.error('Analytics generation error:', error);
    res.status(500).json({ error: 'Error generating analytics' });
  }
});

app.get('/api/journal/stats', authMiddleware, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user._id });
    
    const stats = {
      totalEntries: entries.length,
      averageMood: entries.length ? 
        entries.reduce((acc, entry) => acc + (entry.sentimentScore || 0), 0) / entries.length : 
        0,
      averageSentiment: entries.length ? 
        entries.reduce((acc, entry) => acc + (entry.sentimentScore || 0), 0) / entries.length :
        0
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({ name, email, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.patch('/api/user/reminders', authMiddleware, async (req, res) => {
  try {
    const { reminderEnabled, reminderTime } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { reminderEnabled, reminderTime },
      { new: true }
    );
    
    res.json({
      reminderEnabled: user.reminderEnabled,
      reminderTime: user.reminderTime
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reminder settings' });
  }
});

const PORT = 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
