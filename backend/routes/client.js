import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Job from '../models/Job.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/client/dashboard/:userId
router.get('/dashboard/:userId', async (req, res) => {
  const { userId } = req.params;
  // Fetch user details for greeting
  let userName = 'User';
  try {
    const user = await User.findById(userId);
    if (user && user.name) userName = user.name;
  } catch (err) {
    console.error('Error fetching user for dashboard greeting:', err.message);
  }
  try {
    // Aggregate stats
    const activeProjects = await Order.countDocuments({ client: userId, status: { $in: ['in_progress', 'in_review'] } });
    const completedProjects = await Order.countDocuments({ client: userId, status: 'completed' });
    const totalSpentAgg = await Order.aggregate([
      { $match: { client: userId, status: { $in: ['completed', 'in_progress', 'in_review'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalSpent = totalSpentAgg[0]?.total || 0;
    const activeJobs = await Job.countDocuments({ client: userId, status: { $in: ['active', 'in_progress'] } });
    const jobs = await Job.find({ client: userId });
    const ratings = jobs.flatMap(job => job.reviews?.map(r => r.rating) || []);
    const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;
    const totalSavings = 2340; // Placeholder, adjust if you have logic

    // List all orders for the client
    const allOrders = await Order.find({ client: userId })
      .sort({ createdAt: -1 })
      .populate('freelancer', 'name profilePicture');
    const ordersData = allOrders.map(order => ({
      id: order._id,
      title: order.title,
      freelancer: order.freelancer?.name || 'Unknown',
      freelancerAvatar: order.freelancer?.profilePicture || '',
      service: order.service,
      amount: order.amount,
      status: order.status,
      deadline: order.deadline ? order.deadline.toISOString().split('T')[0] : '',
      progress: order.progress || 0,
      lastUpdate: order.updatedAt ? order.updatedAt.toLocaleString() : '',
    }));

    // List active orders (for backward compatibility)
    const activeOrders = await Order.find({ client: userId, status: { $in: ['in_progress', 'in_review', 'delivered'] } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('freelancer', 'name profilePicture');
    const activeOrdersData = activeOrders.map(order => ({
      id: order._id,
      title: order.title,
      freelancer: order.freelancer?.name || 'Unknown',
      freelancerAvatar: order.freelancer?.profilePicture || '',
      service: order.service,
      amount: order.amount,
      status: order.status,
      deadline: order.deadline ? order.deadline.toISOString().split('T')[0] : '',
      progress: order.progress || 0,
      lastUpdate: order.updatedAt ? order.updatedAt.toLocaleString() : '',
    }));

    // List posted jobs
    let postedJobs = [];
    console.log('Fetching posted jobs for userId:', userId);
    try {
      postedJobs = await Job.find({ client: new mongoose.Types.ObjectId(userId) })
        .sort({ createdAt: -1 }); // fetch all jobs, not limited to 5
    } catch (err) {
      console.error('Error fetching posted jobs with ObjectId:', err.message);
      console.error(err.stack);
      // Fallback: try as string
      try {
        postedJobs = await Job.find({ client: userId })
          .sort({ createdAt: -1 }); // fetch all jobs, not limited to 5
      } catch (err2) {
        console.error('Error fetching posted jobs with string:', err2.message);
        console.error(err2.stack);
        return res.status(400).json({ message: 'Invalid userId for posted jobs.' });
      }
    }
    console.log('Fetched postedJobs:', postedJobs);
    const postedJobsData = postedJobs.map(job => ({
      id: job._id,
      title: job.title,
      description: job.description,
      budget: job.budget,
      postedDate: job.createdAt ? job.createdAt.toISOString().split('T')[0] : '',
      proposals: job.proposals?.length || 0,
      status: job.status,
      category: job.category,
      deadline: job.deadline ? job.deadline.toISOString().split('T')[0] : '',
    }));

    // List recent messages
    const messages = await Message.find({ recipient: userId })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(5);
    const recentMessages = messages.map(msg => ({
      id: msg._id,
      freelancer: msg.sender?.name || 'Unknown',
      avatar: msg.sender?.profilePicture || '',
      message: msg.content,
      time: msg.createdAt ? msg.createdAt.toLocaleString() : '',
      unread: !msg.read,
      project: msg.projectTitle || '',
    }));

    res.json({
      userName, // Pass the real user's name for greeting
      stats: {
        activeProjects,
        totalSpent,
        completedProjects,
        avgRating,
        totalSavings,
        activeJobs,
      },
      orders: ordersData, // All orders for the dashboard
      activeOrders: activeOrdersData, // Backward compatibility
      postedJobs: postedJobsData,
      recentMessages,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
