import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  coverPhoto: { type: String },
  title: { type: String },
  overview: { type: String },
  role: { type: String, enum: ['freelancer', 'client', 'admin'], required: true },
  status: { type: String, enum: ['active', 'suspended', 'pending', 'banned'], default: 'active' },
  verified: { type: Boolean, default: false },
  joinDate: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  totalEarnings: { type: Number, default: 0 }, // for freelancers
  totalSpent: { type: Number, default: 0 },    // for clients
  completedProjects: { type: Number, default: 0 }, // for freelancers
  postedJobs: { type: Number, default: 0 },        // for clients
  rating: { type: Number, default: 0 },
  location: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema); 