import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  project: {
    type: String,
    default: '',
  },
  lastMessage: {
    content: String,
    timestamp: Date,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: String,
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {},
  },
  isPinned: {
    type: Map,
    of: Boolean,
    default: {},
  },
  isArchived: {
    type: Map,
    of: Boolean,
    default: {},
  },
});

const Conversation = mongoose.model('Conversation', ConversationSchema);
export default Conversation;
