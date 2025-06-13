const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const cors = require('cors')
const { default: axios } = require('axios')
const generateToken = require('./utils/generateToken')
const protect = require('./middleware/authMiddleware')
const postRoutes = require('./routes/postRoutes')
const User = require('./models/User')
const Conversation = require('./models/Conversation')
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express()
const port = 3001

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: ['http://localhost:5173', 'http://localhost:5174'], methods: ['GET', 'POST'] }
});

// Attach io instance to app
app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join conversation room
  socket.on('joinRoom', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined room ${conversationId}`);
  });

  // Leave conversation room
  socket.on('leaveRoom', (conversationId) => {
    socket.leave(conversationId);
    console.log(`User ${socket.id} left room ${conversationId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Enable CORS for all routes
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both frontend ports
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Added PATCH here
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

// MongoDB connection
mongoose.connect('mongodb+srv://marouanebounou23:marwanbounou@marwanbounou.oiniil4.mongodb.net/?retryWrites=true&w=majority&appName=marwanbounou')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err))

app.use(express.json())

app.post('/signup', async (req, res) => {
    try {
        console.log('Received signup request:', req.body);
        
        const { email, password, role, number, firstname, secondname, type, service, experience, companyname } = req.body;

        // Validate required fields
        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password, and role are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            role,
            number: number ? parseInt(number) : undefined,
            firstname,
            secondname,
            type,
            service,
            experience,
            companyname
        });
        
        await newUser.save();
        
        res.status(201).json({ 
            message: 'User created successfully',
            user: {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                firstname: newUser.firstname,
                secondname: newUser.secondname,
                type: newUser.type,
                service: newUser.service,
                experience: newUser.experience,
                companyname: newUser.companyname,
                createdAt: newUser.createdAt,
                token: generateToken(newUser._id)
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                firstname: user.firstname,
                secondname: user.secondname,
                type: user.type,
                service: user.service,
                experience: user.experience,
                companyname: user.companyname,
                token: generateToken(user._id)
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/protected', protect, (req, res) => {
    res.json({ message: 'Access granted', user: req.user });
});

app.use('/api/posts', postRoutes);

// Update user profile
app.put('/api/users/update', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Handle password change if provided
    if (updates.currentPassword && updates.newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(updates.currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash and update new password
      const hashedPassword = await bcrypt.hash(updates.newPassword, 10);
      user.password = hashedPassword;

      // Remove password fields from updates to prevent them from being saved as plain text
      delete updates.currentPassword;
      delete updates.newPassword;
    }

    // Update other fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && updates[key] !== '') {
        user[key] = updates[key];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        secondname: user.secondname,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        website: user.website,
        linkedin: user.linkedin,
        twitter: user.twitter,
        github: user.github
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (for dashboard contacts)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Search users by name
app.get('/api/users/search', protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 3) {
      return res.status(400).json({ error: 'Search query must be at least 3 characters long' });
    }

    const users = await User.find({
      $or: [
        { firstname: { $regex: q, $options: 'i' } },
        { secondname: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user.id } // Exclude the current user
    }, '-password');

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Get all conversations for the current user
app.get('/api/conversations', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate('participants', 'firstname secondname email')
      .populate('post')
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get a specific conversation
app.get('/api/conversations/:id', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'firstname secondname email')
      .populate('post');

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Check if user is a participant
    if (!conversation.participants.some(p => p._id.toString() === req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Create a new conversation
app.post('/api/conversations', protect, async (req, res) => {
  try {
    const { participant, post, message } = req.body;
    const userId = req.user.id;

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, participant] },
      post: post
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // Create new conversation
    const conversation = new Conversation({
      participants: [userId, participant],
      post: post,
      messages: message ? [{
        sender: userId,
        content: message,
        timestamp: new Date()
      }] : []
    });

    await conversation.save();

    // Populate the response with user details
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'firstname secondname email')
      .populate('post');

    res.status(201).json(populatedConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Send a message in a conversation
app.post('/api/conversations/:id/message', protect, async (req, res) => {
  try {
    const { content } = req.body;
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'firstname secondname email role companyname');

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Check if user is a participant
    if (!conversation.participants.some(p => p._id.toString() === req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const message = {
      sender: req.user.id,
      content,
      timestamp: new Date()
    };

    conversation.messages.push(message);
    await conversation.save();

    // Get sender's name based on their role
    const sender = conversation.participants.find(p => p._id.toString() === req.user.id);
    const senderName = sender.role === 'freelancer' ? sender.companyname : `${sender.firstname} ${sender.secondname}`;

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to(req.params.id).emit('receiveMessage', {
        ...message,
        conversationId: req.params.id,
        senderName: senderName,
        senderRole: sender.role
      });
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Delete a conversation
app.delete('/api/conversations/:id', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Check if user is a participant
    if (!conversation.participants.some(p => p.toString() === req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Conversation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




