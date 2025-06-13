const Conversation = require('../models/Conversation');

exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({
      participants: userId
    })
      .populate('participants', 'firstname secondname email')
      .populate('post');
    res.status(200).json(conversations);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    const message = {
      sender: userId,
      content,
      timestamp: new Date()
    };
    conversation.messages.push(message);
    await conversation.save();
    // Emit real-time update
    if (req.app.get('io')) {
      req.app.get('io').to(conversationId).emit('receiveMessage', { ...message, conversationId });
    }
    res.status(200).json(message);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
