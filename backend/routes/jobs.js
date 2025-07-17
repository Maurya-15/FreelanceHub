import express from 'express';
import { Job, User } from '../db.js';
import Order from '../models/Order.js';
import Activity from '../models/Activity.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/job-attachments/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

const router = express.Router();

// Create a new job (accepts JSON body)
router.post(
  '/',
  upload.array('attachments', 10), // up to 10 files
  async (req, res) => {
    try {
      const {
        title, description, category, skills, budget, duration, experience, location,
        additionalQuestions, requirements, isUrgent, deadline, status
      } = req.body;
      const clientId = req.headers['user-id'];
      // Parse skills and additionalQuestions if sent as JSON strings
      const parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
      const parsedQuestions = typeof additionalQuestions === 'string' ? JSON.parse(additionalQuestions) : additionalQuestions;
      const attachments = req.files?.map(file => ({
        name: file.originalname,
        size: file.size,
        url: `/uploads/job-attachments/${file.filename}`
      })) || [];
      const job = new Job({
        title,
        description,
        client: clientId,
        category,
        skills: parsedSkills,
        budget: typeof budget === 'string' ? JSON.parse(budget) : budget,
        duration,
        experience,
        location: location || 'Remote',
        additionalQuestions: parsedQuestions,
        requirements,
        isUrgent,
        deadline,
        status,
        attachments,
      });
      await job.save();
      // Log job activity
      const user = await User.findById(clientId);
      await Activity.create({
        type: 'job',
        user: { id: user?._id, name: user?.name, role: user?.role },
        message: `created new job '${job.title}'`,
        status: 'pending',
        meta: { jobId: job._id }
      });
      res.status(201).json({ success: true, job });
    } catch (err) {
      console.error('Error creating job:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const { search, category, skills } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      query.category = category;
    }
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }

    const jobs = await Job.find(query)
      .populate('client', 'name email profilePicture') // ✅ populate client info
      .sort({ createdAt: -1 });

    res.json({ success: true, jobs });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  if (!req.params.id || req.params.id === 'undefined') {
    return res.status(400).json({ success: false, message: 'Invalid job ID' });
  }
  try {
    const job = await Job.findById(req.params.id)
      .populate('client', 'name email profilePicture')
      .populate('proposals.freelancer', 'name email profilePicture');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, job });
  } catch (err) {
    console.error('Error fetching job by ID:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Submit a proposal
router.post('/:id/proposals', async (req, res) => {
  try {
    const { coverLetter, proposedBudget, estimatedDuration } = req.body;
    const freelancerId = req.headers['user-id']; // ✅ read freelancer ID from headers

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if freelancer has already submitted a proposal
    const existingProposal = job.proposals.find(
      (p) => p.freelancer.toString() === freelancerId
    );
    if (existingProposal) {
      return res.status(400).json({ success: false, message: 'You have already submitted a proposal for this job' });
    }

    job.proposals.push({
      freelancer: freelancerId,
      coverLetter,
      proposedBudget,
      estimatedDuration,
    });

    await job.save();
    res.json({ success: true, message: 'Proposal submitted successfully' });
  } catch (err) {
    console.error('Error submitting proposal:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get jobs for a specific client (only accessible by that client)
router.get('/client/:clientId', async (req, res) => {
  try {
    const userIdHeader = req.headers['user-id'];
    if (!userIdHeader) {
      return res.status(401).json({ success: false, message: 'Missing user-id header' });
    }
    const match = userIdHeader.match(/userId-clientId-([a-f\d]{24})/i);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Invalid user-id header format' });
    }
    const clientIdFromHeader = match[1];
    const { clientId } = req.params;
    if (clientIdFromHeader !== clientId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only view your own posted jobs.' });
    }
    const jobs = await Job.find({ client: clientId })
      .populate('client', 'name email profilePicture')
      .sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    console.error('Error fetching client jobs:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Accept a proposal
router.patch('/:jobId/proposals/:proposalId/accept', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const { jobId, proposalId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.client.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only accept proposals for your own jobs.' });
    }
    let proposalFound = null;
    // Accept the selected proposal, reject all others
    job.proposals.forEach((proposal) => {
      if (proposal._id.toString() === proposalId) {
        proposal.status = 'accepted';
        proposalFound = proposal;
        // Simulate notification
        console.log(`[NOTIFY] Freelancer ${proposal.freelancer}: Your proposal was ACCEPTED for job ${jobId}`);
      } else {
        proposal.status = 'rejected';
      }
    });
    if (!proposalFound) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }
    await job.save();
    // Create the order
    const order = new Order({
      client: job.client,
      freelancer: proposalFound.freelancer,
      gig: job._id, // using job as gig reference
      status: 'pending',
      amount: proposalFound.proposedBudget || 0,
    });
    await order.save();
    res.json({ success: true, message: 'Proposal accepted and others rejected. Order created.', order });
  } catch (err) {
    console.error('Error accepting proposal:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reject a proposal
router.patch('/:jobId/proposals/:proposalId/reject', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const { jobId, proposalId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.client.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only reject proposals for your own jobs.' });
    }
    const proposal = job.proposals.id(proposalId);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }
    proposal.status = 'rejected';
    // Simulate notification
    console.log(`[NOTIFY] Freelancer ${proposal.freelancer}: Your proposal was REJECTED for job ${jobId}`);
    await job.save();
    res.json({ success: true, message: 'Proposal rejected.' });
  } catch (err) {
    console.error('Error rejecting proposal:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
