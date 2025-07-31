import mongoose from 'mongoose';
import { User } from './db.js';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/freelanceapp';

async function backfillJoinDates() {
  await mongoose.connect(MONGO_URI);

  const users = await User.find({
    $or: [
      { joinDate: { $exists: false } },
      { lastActive: { $exists: false } }
    ]
  });

  for (const user of users) {
    const createdDate = user._id.getTimestamp();
    if (!user.joinDate) user.joinDate = createdDate;
    if (!user.lastActive) user.lastActive = createdDate;
    await user.save();
    // Updated user: ${user.email}
  }

  // Backfill complete!
  mongoose.disconnect();
}

backfillJoinDates(); 