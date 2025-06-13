const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', conversationController.getUserConversations);
router.post('/:conversationId/message', conversationController.sendMessage);

module.exports = router;
