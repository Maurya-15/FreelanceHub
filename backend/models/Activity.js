import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., registration, gig, order, dispute, payment, admin-action
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    role: String,
  },
  message: { type: String, required: true },
  status: { type: String, enum: ['success', 'pending', 'warning', 'info', 'error'], default: 'info' },
  meta: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema); 