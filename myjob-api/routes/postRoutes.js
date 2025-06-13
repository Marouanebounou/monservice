const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const protect = require('../middleware/authMiddleware');

// All routes are protected and require authentication
router.use(protect);

// Create a new post
router.post('/', postController.createPost);

// Get all posts for the current client
router.get('/client', postController.getClientPosts);

// Get all posts (for freelancers to view all client posts)
router.get('/all', postController.getAllPosts);

// Delete a post
router.delete('/:id', postController.deletePost);

// Update a post
router.put('/:id', postController.updatePost);

// Apply to a post
router.post('/apply', postController.applyToPost);

// Handle application (accept/reject)
router.patch('/:postId/applications/:freelancerId', postController.handleApplication);

module.exports = router;