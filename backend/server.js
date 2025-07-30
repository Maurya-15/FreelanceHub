import express from 'express';
import connectDB, { User, Gig } from './db.js';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createServer } from 'http';
import { Server } from 'socket.io';
import usersRouter from './routes/users.js';
import messagesRouter from './routes/messages.js';
import gigsRouter from './routes/gigs.js';
import ordersRouter from './routes/orders.js';
import jobsRouter from './routes/jobs.js';
import adminRouter from './routes/admin.js';
import clientRouter from './routes/client.js';
import freelancerRouter from './routes/freelancer.js';
import Activity from './models/Activity.js';
import mongoose from "mongoose";
import dotenv from 'dotenv';



const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:8080',
      'http://localhost:3000',
      'http://localhost:8000',
      'http://localhost:8081',
      'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
});

app.set('io', io); // Make io available in routes
app.locals.io = io;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join('./', 'uploads/')));

// Connect to database
connectDB();

// Logger middleware
function logger(req, res, next) {
  // console.log(`${req.method} ${req.url}`);
  next();
}
  app.use(logger);

// CORS options
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:8000',
    'http://localhost:8081',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions));

// Multer configuration for gig uploads
const gigUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

// Helper to log activity
async function logActivity({ type, user, message, status = 'info', meta = {} }) {
  await Activity.create({ type, user, message, status, meta });
}
app.locals.logActivity = logActivity;

// Only keep the root route here
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount all routers


app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/gigs', gigsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api', adminRouter);
app.use('/api/client', clientRouter);
app.use('/api/freelancer', freelancerRouter);

// Remove any remaining direct definitions of /api/activities, /api/pending-actions, and /api/admin/stats from server.js

const PORT = process.env.PORT || 5000;

// --- SOCKET.IO REAL-TIME MESSAGING ---
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';

const onlineUsers = new Map();
io.on('connection', (socket) => {
  // Join user and conversation rooms
  socket.on('join', async ({ userId, conversationId }) => {
    if (userId) {
      socket.join(`user_${userId}`);
      onlineUsers.set(userId, socket.id);
      // Optionally update user status in DB
      try {
        await User.findByIdAndUpdate(userId, { status: 'online', lastActive: new Date() });
      } catch {}
      io.emit('userStatus', { userId, status: 'online' });
    }
    if (conversationId) socket.join(`conversation_${conversationId}`);
  });

  socket.on('leave', async ({ userId, conversationId }) => {
    if (userId) {
      socket.leave(`user_${userId}`);
      onlineUsers.delete(userId);
      // Optionally update user status in DB
      try {
        await User.findByIdAndUpdate(userId, { status: 'offline', lastActive: new Date() });
      } catch {}
      io.emit('userStatus', { userId, status: 'offline' });
    }
    if (conversationId) socket.leave(`conversation_${conversationId}`);
  });

  // Real-time message delivery
  socket.on('sendMessage', async (data, callback) => {
    try {
      const message = new Message({
        conversationId: data.conversationId,
        sender: data.sender,
        recipient: data.recipient,
        content: data.content,
        type: data.type || 'text',
        attachment: data.attachment || null,
        status: 'sent',
      });
      await message.save();

      // Update lastMessage in Conversation
      await Conversation.findByIdAndUpdate(data.conversationId, {
        lastMessage: {
          content: data.content,
          timestamp: message.timestamp,
          sender: data.sender,
          type: data.type || 'text',
        },
      });

      // Emit to all participants in the conversation
      io.to(`conversation_${data.conversationId}`).emit('newMessage', message);

      // Emit notification to recipient only
      io.to(`user_${data.recipient}`).emit('notification', {
        type: 'newMessage',
        message,
      });
      if (typeof callback === 'function') callback({ status: 'ok' });
    } catch (err) {
      if (typeof callback === 'function') callback({ status: 'error', message: err.message });
      else socket.emit('error', { message: err.message });
    }
  });

  // Mark message as delivered/read
  socket.on('messageStatus', async ({ messageId, status }) => {
    try {
      await Message.findByIdAndUpdate(messageId, { status });
      // Optionally notify sender
      const message = await Message.findById(messageId);
      if (message) {
        io.to(`user_${message.sender}`).emit('messageStatusUpdate', { messageId, status });
      }
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });
  socket.on('disconnect', async () => {
    for (const [userId, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(userId);
        // Optionally update user status in DB
        try {
          await User.findByIdAndUpdate(userId, { status: 'offline', lastActive: new Date() });
        } catch {}
        io.emit('userStatus', { userId, status: 'offline' });
      }
    }
  });
});


  
server.listen(PORT, () => {});