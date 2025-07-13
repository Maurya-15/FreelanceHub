import express from 'express';
import Order from '../models/Order.js';
import { User } from '../db.js';
import { Gig } from '../db.js';

const router = express.Router();

// GET /api/orders - List all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('client', 'name email profilePicture')
      .populate('freelancer', 'name email profilePicture')
      .populate('gig', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id - Get order details
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('client', 'name email profilePicture')
      .populate('freelancer', 'name email profilePicture')
      .populate('gig', 'title');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id - Update order status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (status) order.status = status;
    order.updatedAt = new Date();
    await order.save();
    // Emit real-time events for disputes and payment issues
    if (status === 'disputed') {
      req.app.get('io').emit('orderDisputed', order);
    } else if (status === 'pending') {
      req.app.get('io').emit('paymentIssue', order);
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router; 