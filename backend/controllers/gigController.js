import Gig from '../models/Gig.js';
import mongoose from 'mongoose';

export const createGig = (io, gigUpload) => async (req, res) => {
  try {
    const { title, description, category, packages, activePackage } = req.body;
    const userIdHeader = req.headers['user-id'];
    const match = userIdHeader ? userIdHeader.match(/userId-freelancerId-([a-f\d]{24})/i) : null;
    const freelancer = match ? mongoose.Types.ObjectId(match[1]) : null;
    if (!title || !description || !category || !freelancer || !packages || !activePackage) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    // Store images as Buffers
    const images = req.files ? req.files.map(f => ({ data: f.buffer, contentType: f.mimetype })) : [];
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
    io.emit('gigCreated', gig);
    res.status(201).json({ success: true, gig });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyGigs = async (req, res) => {
  try {
    const userIdHeader = req.headers['user-id'];
    const match = userIdHeader ? userIdHeader.match(/userId-freelancerId-([a-f\d]{24})/i) : null;
    const freelancer = match ? match[1] : null;
    if (!freelancer) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const freelancerId = mongoose.Types.ObjectId.isValid(freelancer)
  ? new mongoose.Types.ObjectId(freelancer)
  : freelancer;
const gigs = await Gig.find({ freelancer: freelancerId }).sort({ createdAt: -1 });
res.json({ success: true, gigs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('freelancer', 'name avatar profilePicture email location rating completedProjects role username level description memberSince responseTime languages skills');
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    res.json({ success: true, gig });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateGig = (io, gigUpload) => async (req, res) => {
  try {
    const { title, description, category, packages, activePackage } = req.body;
    const userIdHeader = req.headers['user-id'];
    const match = userIdHeader ? userIdHeader.match(/userId-freelancerId-([a-f\d]{24})/i) : null;
    const freelancer = match ? match[1] : null;
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    if (gig.freelancer.toString() !== freelancer) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    if (req.files && req.files.length > 0) {
      gig.images = req.files.map(f => ({ data: f.buffer, contentType: f.mimetype }));
    }
    gig.title = title;
    gig.description = description;
    gig.category = category;
    gig.packages = JSON.parse(packages);
    gig.activePackage = activePackage;
    gig.updatedAt = new Date();
    await gig.save();
    io.emit('gigUpdated', gig);
    res.json({ success: true, gig });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteGig = (io) => async (req, res) => {
  try {
    const userIdHeader = req.headers['user-id'];
    const match = userIdHeader ? userIdHeader.match(/userId-freelancerId-([a-f\d]{24})/i) : null;
    const freelancer = match ? match[1] : null;
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
    if (gig.freelancer.toString() !== freelancer) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    await gig.deleteOne();
    io.emit('gigDeleted', gig._id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find()
      .sort({ createdAt: -1 })
      .populate('freelancer', 'name username avatar profilePicture level rating');
    res.json({ success: true, gigs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 