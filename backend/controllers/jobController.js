import { Job, User } from '../db.js';

export const createJob = async (req, res) => {
  try {
    const { title, description, category, skills, budget, duration, experience, location } = req.body;
    const clientId = req.headers['user-id'];
    if (!title || !description || !category || !skills || !budget || !duration || !experience) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Parse skills if it's a string (from frontend)
    const parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;

    // Handle attachments from multer
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
      attachments,
    });

    await job.save();
    res.status(201).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllJobs = async (req, res) => {
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
      .populate('client', 'name email profilePicture')
      .sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('client', 'name email profilePicture')
      .populate('proposals.freelancer', 'name email profilePicture');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitProposal = async (req, res) => {
  try {
    const { coverLetter, proposedBudget, estimatedDuration } = req.body;
    const freelancerId = req.headers['user-id'];
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
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
    res.status(500).json({ success: false, message: err.message });
  }
}; 