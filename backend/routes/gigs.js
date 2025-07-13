import express from 'express';
import { Gig, User } from '../db.js';
import mongoose from 'mongoose';

const router = express.Router();

// Create a new gig
router.post('/', async (req, res) => {
  try {
    const { title, description, category, packages, activePackage } = req.body;
    const freelancer = req.headers['user-id'].split('-')[2];
    if (!title || !description || !category || !freelancer || !packages || !activePackage) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const images = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];
    const gig = new Gig({
      title,
      description,
      category,
      images,
      freelancer,
      packages: JSON.parse(packages),
      activePackage,
    });
    await gig.save();
    req.app.get('io').emit('gigCreated', gig);
    let freelancerUser = null;
    try {
      freelancerUser = await User.findById(gig.freelancer);
      if (!freelancerUser) {
        freelancerUser = await User.findOne({ email: gig.freelancer });
      }
    } catch (e) {
      freelancerUser = await User.findOne({ email: gig.freelancer });
    }
    await req.app.get('logActivity')({
      type: 'gig',
      user: { id: gig.freelancer, name: freelancerUser ? freelancerUser.name : 'Unknown', role: 'freelancer' },
      message: `created new gig '${gig.title}'`,
      status: 'pending',
    });
    res.status(201).json({ success: true, gig });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all gigs for the logged-in freelancer
router.get('/my', async (req, res) => {
  try {
    const userIdHeader = req.headers['user-id'];
    if (!userIdHeader) {
      return res.status(401).json({ success: false, message: 'Missing user-id header' });
    }
    const match = userIdHeader.match(/userId-freelancerId-([a-f\d]{24})/i);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Invalid user-id header format' });
    }
    const freelancer = match[1];
    if (!mongoose.Types.ObjectId.isValid(freelancer)) {
      return res.status(400).json({ success: false, message: 'Invalid user ObjectId' });
    }
    const gigs = await Gig.find({ freelancer }).sort({ createdAt: -1 });
    res.json({ success: true, gigs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all gigs in the system
router.get('/', async (req, res) => {
  try {
    const gigs = await Gig.find().sort({ createdAt: -1 });
    res.json({ success: true, gigs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get a single gig by ID
router.get('/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    res.json({ success: true, gig });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Edit a gig
router.put('/:id', async (req, res) => {
  try {
    const { title, description, category, packages, activePackage } = req.body;
    const freelancer = req.headers['user-id'];
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    if (gig.freelancer.toString() !== freelancer) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    if (req.files && req.files.length > 0) {
      gig.images = req.files.map(f => '/uploads/' + f.filename);
    }
    gig.title = title;
    gig.description = description;
    gig.category = category;
    gig.packages = JSON.parse(packages);
    gig.activePackage = activePackage;
    gig.updatedAt = new Date();
    await gig.save();
    req.app.get('io').emit('gigUpdated', gig);
    res.json({ success: true, gig });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Suspend a gig
router.put('/:id/suspend', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    gig.status = 'suspended';
    await gig.save();
    res.json({ success: true, gig });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Approve a gig
router.put('/:id/approve', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    gig.status = 'active';
    await gig.save();
    req.app.get('io').emit('gigApproved', gig);
    res.json({ success: true, gig });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Feature/Unfeature a gig
router.put('/:id/feature', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    gig.featured = !gig.featured;
    await gig.save();
    res.json({ success: true, gig });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Delete any gig
router.delete('/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    await gig.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router; 