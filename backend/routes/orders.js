import express from 'express';
import Order from '../models/Order.js';
import { User } from '../db.js';
import { Gig } from '../db.js';

const router = express.Router();

// GET /api/orders - List all orders (admin/freelancer/client)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('client', 'name email profilePicture')
      .populate('freelancer', 'name email profilePicture')
      .populate('gig')
      .sort({ createdAt: -1 });

    // Ensure every order has a title field for the frontend
    const ordersWithTitle = orders.map(order => ({
      ...order.toObject(),
      title: order.title || (order.gig && order.gig.title) || "Untitled Order"
    }));

    res.json({ success: true, orders: ordersWithTitle });
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
      .populate('gig');
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

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    const { client, freelancer, gig, package: selectedPackage, amount } = req.body;
    if (!client || !freelancer || !gig || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    // Get the gig to get its title
    const gigDoc = await Gig.findById(gig);
    if (!gigDoc) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }
    const order = new Order({
      client,
      freelancer,
      gig,
      title: gigDoc.title, // Set the title from the gig
      amount,
      // Optionally add package or other fields
      // package: selectedPackage,
    });
    await order.save();
    
    // Update the gig's orders count
    await Gig.findByIdAndUpdate(gig, { $inc: { orders: 1 } });
    
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router; 