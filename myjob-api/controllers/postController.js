const Post = require('../models/Post');
const User = require('../models/employee');
const Conversation = require('../models/Conversation');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, description, location, budget, deadline, category, skills } = req.body;
    
    // Get the client ID from the authenticated user
    const client = req.user.id;

    const post = new Post({
      title,
      description,
      location,
      budget,
      deadline,
      category,
      skills,
      client
    });

    await post.save();

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all posts for a specific client
exports.getClientPosts = async (req, res) => {
  try {
    const clientId = req.user.id;
    
    const posts = await Post.find({ client: clientId })
      .sort({ createdAt: -1 })
      .populate('client', 'firstname secondname email')
      .populate('applications.freelancer', 'firstname secondname email companyname number location bio');

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching client posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all posts (for freelancers to view all client posts)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('client', 'firstname secondname email')
      .populate('applications.freelancer', 'firstname secondname email companyname number location bio');
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching all posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const clientId = req.user.id;

    // Find the post and verify ownership
    const post = await Post.findOne({ _id: postId, client: clientId });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const clientId = req.user.id;
    const updates = req.body;

    // Find the post and verify ownership
    const post = await Post.findOne({ _id: postId, client: clientId });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    // Update the post
    Object.assign(post, updates);
    post.updatedAt = new Date();
    await post.save();

    res.status(200).json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Freelancer applies to a post
exports.applyToPost = async (req, res) => {
  console.log('POST /api/posts/apply called', req.body, req.user);
  try {
    // Check if user is a freelancer
    if (!req.user || req.user.role !== 'provider') {
      return res.status(400).json({ error: 'Only freelancers can apply to posts.' });
    }
    const { postId } = req.body;
    const freelancerId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    // Prevent duplicate application
    if (post.applications.some(app => app.freelancer.toString() === freelancerId)) {
      return res.status(400).json({ error: 'Already applied' });
    }
    post.applications.push({ freelancer: freelancerId });
    await post.save();
    res.status(200).json({ message: 'Application sent' });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Client accepts/rejects an application
exports.handleApplication = async (req, res) => {
  try {
    const { postId, freelancerId } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'
    const post = await Post.findById(postId);
    if (!post) {
      console.error(`[handleApplication] Post not found: postId=${postId}`);
      return res.status(404).json({ error: 'Post not found' });
    }
    // Only the client can accept/reject
    if (post.client.toString() !== req.user.id) {
      console.error(`[handleApplication] Forbidden: user ${req.user.id} is not the owner of post ${postId}`);
      return res.status(403).json({ error: 'Forbidden: you are not the owner of this post.' });
    }
    const application = post.applications.find(app => app.freelancer.toString() === freelancerId);
    if (!application) {
      console.error(`[handleApplication] Application not found: freelancerId=${freelancerId} for postId=${postId}`);
      return res.status(404).json({ error: 'Application not found for this freelancer.' });
    }
    application.status = status;
    await post.save();
    // If accepted, create a conversation if not exists
    if (status === 'accepted') {
      const exists = await Conversation.findOne({
        participants: { $all: [req.user.id, freelancerId] },
        post: postId
      });
      if (!exists) {
        await Conversation.create({
          participants: [req.user.id, freelancerId],
          post: postId,
          messages: []
        });
      }
    }
    res.status(200).json({ message: `Application ${status}` });
  } catch (e) {
    console.error('[handleApplication] Internal server error:', e);
    res.status(500).json({ error: 'Internal server error', details: e.message });
  }
};