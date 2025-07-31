import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  client: { type: String, required: true }, // or ObjectId if needed
  title: { type: String, required: true },
  description: String,
  budget: String,
  jobType: { type: String, enum: ['fixed', 'hourly'], default: 'fixed' },
  status: { type: String, enum: ['active', 'in_progress', 'completed'], default: 'active' },
  category: String,
  deadline: Date,
  proposals: [{
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: String,
  proposedBudget: String,
  estimatedDuration: String,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
}],
  reviews: [{
    rating: Number,
    comment: String,
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Prevent OverwriteModelError in dev/hot-reload:
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

export default Job;