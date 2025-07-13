import express from 'express';
import * as messageController from '../controllers/messageController.fix.js';
const router = express.Router();

// Get or create a conversation between two users
router.post('/conversation', messageController.getOrCreateConversation);

// Get all conversations for a user
router.get('/conversations/:userId', messageController.getUserConversations);

// Get messages for a conversation
router.get('/:conversationId', messageController.getMessages);

// Send a message
router.post('/', messageController.sendMessage);

export default router;