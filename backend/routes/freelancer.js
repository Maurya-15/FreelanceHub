import express from "express";
import Job from "../models/Job.js";
import Order from "../models/Order.js";
import Gig from "../models/Gig.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const router = express.Router();

// GET /api/freelancer/dashboard/:freelancerId
router.get("/dashboard/:freelancerId", async (req, res) => {
  try {
    const { freelancerId } = req.params;

    // Stats
    const totalEarnings = await Order.aggregate([
      { $match: { freelancer: freelancerId, status: { $in: ["completed", "delivered"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const activeGigs = await Gig.countDocuments({ freelancer: freelancerId, status: "active" });

    const user = await User.findById(freelancerId);
    const avgRating = user ? user.rating || 0 : 0;
    const profileViews = user ? user.profileViews || 0 : 0;
    const responseTime = user ? user.responseTime || "-" : "-";

    // Recent Orders
    const recentOrders = await Order.find({ freelancer: freelancerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("client", "name")
      .lean();
    const formattedOrders = recentOrders.map((order) => ({
      id: order._id,
      title: order.title,
      client: order.client?.name || "",
      amount: order.amount,
      status: order.status,
      deadline: order.deadline,
      avatar: order.client?.profilePicture || "",
    }));

    // Top Gigs
    const topGigs = await Gig.find({ freelancer: freelancerId })
      .sort({ impressions: -1 })
      .limit(2)
      .lean();
    const formattedGigs = topGigs.map((gig) => ({
      id: gig._id,
      title: gig.title,
      image: gig.coverImage || "",
      price: gig.price,
      orders: gig.orders || 0,
      rating: gig.rating || 0,
      reviews: gig.reviews || 0,
      impressions: gig.impressions || 0,
    }));

    res.json({
      stats: {
        totalEarnings: totalEarnings[0]?.total || 0,
        activeGigs,
        totalOrders,
        avgRating,
        profileViews,
        responseTime,
        name: user ? user.name : "",
        totalGigs: await Gig.countDocuments({ freelancer: freelancerId }),
      },
      recentOrders: formattedOrders,
      topGigs: formattedGigs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
