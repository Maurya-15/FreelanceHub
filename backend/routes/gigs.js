import express from 'express';
import { Gig, User } from '../db.js';
import mongoose from 'mongoose';
import multer from 'multer';

// Configure multer to save files to disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });
const router = express.Router();
import { getGigById, getMyGigs } from '../controllers/gigController.js';

// Get all gigs for the logged-in freelancer
router.get('/my', getMyGigs);

// Fetch a gig by ID
router.get('/:id', getGigById);

// Create a new gig
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    // Parse fields from multipart/form-data (FormData)
    let { title, description, category, packages, activePackage } = req.body;
    const freelancer = req.headers['user-id']?.split('-')[2];
    if (!title || !description || !category || !freelancer || !packages || !activePackage) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    // Parse packages if stringified JSON
    if (typeof packages === 'string') {
      try {
        packages = JSON.parse(packages);
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid packages JSON' });
      }
    }
    // Handle images: save file paths as URLs in DB
    const images = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];
    const gig = new Gig({
      title,
      description,
      category,
      images,
      freelancer,
      packages,
      activePackage,
    });
    await gig.save();
    if (req.app.locals.io) {
      req.app.locals.io.emit('gigCreated', gig);
    }
    let freelancerUser = null;
    try {
      freelancerUser = await User.findById(gig.freelancer);
      if (!freelancerUser) {
        freelancerUser = await User.findOne({ email: gig.freelancer });
      }
    } catch (e) {
      freelancerUser = await User.findOne({ email: gig.freelancer });
    }
    if (req.app.locals.logActivity) {
      await req.app.locals.logActivity({
        type: 'gig',
        user: { id: gig.freelancer, name: freelancerUser ? freelancerUser.name : 'Unknown', role: 'freelancer' },
        message: `created new gig '${gig.title}'`,
        status: 'pending',
      });
    }
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
    const gigs = await Gig.find()
      .populate('freelancer', 'name username email profilePicture')
      .sort({ createdAt: -1 });
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