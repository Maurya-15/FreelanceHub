import mongoose from 'mongoose';
import 'dotenv/config';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['freelancer', 'client', 'admin'], required: true },
  // Freelancer fields
  title: String,
  bio: String,
  skills: [String],
  languages: [
    {
      name: String,
      level: String,
    },
  ],
  experience: String,
  hourlyRate: String,
  // Documents
  certificates: [
    {
      name: String,
      url: String,
      size: Number,
    },
  ],
  profilePicture: String,
  joinDate: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: [{ type: String }], // <-- store image URLs or paths as strings here
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packages: { type: Object, required: true },
  activePackage: { type: String, required: true },
  rating: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  queue: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


export const Gig = mongoose.models.Gig || mongoose.model('Gig', gigSchema);

// Add Job schema and export
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  skills: [String],
  budget: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  duration: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  proposals: [
    {
      freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      coverLetter: String,
      proposedBudget: Number,
      estimatedDuration: String,
      submittedAt: { type: Date, default: Date.now }
    }
  ],
  attachments: [
    {
      name: String,
      size: Number,
      url: String,
    }
  ],
  createdAt: { type: Date, default: Date.now }
}
);

export const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

const connectDB = async () => {
  try {
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
