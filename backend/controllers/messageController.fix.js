import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

// Create or get a conversation between two users
export const getOrCreateConversation = async (req, res) => {
  try {
    const { userId1, userId2, project } = req.body;
    let conversation = await Conversation.findOne({
      participants: { $all: [userId1, userId2] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [userId1, userId2],
        project: project || '',
      });
      await conversation.save();
    }

    await conversation.populate('participants', 'name avatar role');
    res.json({ success: true, conversation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all conversations for a user
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversation.find({
      participants: userId,
    }).populate('participants', 'name avatar role');
    res.json({ success: true, conversations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ timestamp: 1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Send a message
// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, sender, recipient, content, type, attachment } = req.body;

    const message = new Message({
      conversationId,
      sender,
      recipient,
      content,
      type,
      attachment: attachment || null,
      status: 'sent',
    });

    await message.save();

    // Update lastMessage in Conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content,
        timestamp: message.timestamp,
        sender,
        type,
      },
    });

    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export default {
  getOrCreateConversation,
  getUserConversations,
  getMessages,
  sendMessage,
};
