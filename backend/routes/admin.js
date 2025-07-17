import express from 'express';
import Activity from '../models/Activity.js';
import Order from '../models/Order.js';
import { User, Gig } from '../db.js';
import Job from '../models/Job.js';

const router = express.Router();
import freelancerRoutes from './freelancer.js';
router.use('/freelancer', freelancerRoutes);

// GET /api/activities
router.get('/activities', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, activities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/pending-actions
router.get('/pending-actions', async (req, res) => {
  try {
    const gigApproval = await Gig.countDocuments({ status: 'pending' });
    const disputes = await Order.countDocuments({ status: 'disputed' });
    const userVerification = await User.countDocuments({ verified: false, status: { $ne: 'banned' } });
    const paymentIssues = await Order.countDocuments({ status: 'pending' });
    res.json({
      success: true,
      gigApproval,
      disputes,
      userVerification,
      paymentIssues,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/stats
router.get('/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeGigs = await Gig.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalJobs = await Job.countDocuments();
    res.json({
      success: true,
      totalUsers,
      activeGigs,
      totalOrders,
      totalJobs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;