import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../db.js';
import Job from '../models/Job.js';
import Order from '../models/Order.js';
// import logActivity from '../middlewares/logActivity.js'; // removed, now in server.js

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, title, bio, skills, languages, experience, hourlyRate, certificates, profilePicture } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      title,
      bio,
      skills,
      languages,
      experience,
      hourlyRate,
      certificates,
      profilePicture,
    });
    await user.save();
    // await logActivity({ // removed, now in server.js
    //   type: 'registration',
    //   user: { id: user._id, name: user.name, role: user.role },
    //   message: `${user.name} registered as ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`,
    //   status: 'success',
    // });
    const userObj = user.toObject();
    delete userObj.password;
    const token = 'mock-token-' + user._id;
    res.status(201).json({ success: true, user: userObj, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === 'dritu1978@gmail.com') {
      if (password !== '1') {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }
      let user = await User.findOne({ email });
      const hashedPassword = await bcrypt.hash('1', 10);
      if (!user) {
        user = new User({ name: 'Admin', email, password: hashedPassword, role: 'admin' });
        await user.save();
      } else {
        let needsUpdate = false;
        if (user.role !== 'admin') { user.role = 'admin'; needsUpdate = true; }
        const isMatch = await bcrypt.compare('1', user.password);
        if (!isMatch) { user.password = hashedPassword; needsUpdate = true; }
        if (needsUpdate) { await user.save(); }
      }
      const userObj = user.toObject();
      delete userObj.password;
      const token = 'mock-token-' + user._id;
      return res.json({ success: true, user: userObj, token });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    const userObj = user.toObject();
    delete userObj.password;
    const token = 'mock-token-' + user._id;
    res.json({ success: true, user: userObj, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Activate user
router.put('/:id/activate', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify user
router.put('/:id/verify', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    req.app.get('io').emit('userVerified', user);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Ban user
router.put('/:id/ban', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'banned' }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update user profile by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all users (existing logic)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    // Aggregate jobs/projects counts for each user
    const userStats = await Promise.all(users.map(async (user) => {
      let jobsPosted = undefined;
      let projects = undefined;
      if (user.role === 'client') {
        jobsPosted = await Job.countDocuments({ client: user._id.toString() });
      }
      if (user.role === 'freelancer') {
        projects = await Order.countDocuments({ freelancer: user._id });
      }
      const userObj = user.toObject();
      if (jobsPosted !== undefined) userObj.jobsPosted = jobsPosted;
      if (projects !== undefined) userObj.projects = projects;
      return userObj;
    }));
    res.json({ success: true, users: userStats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router; 