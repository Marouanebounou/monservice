const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['buyer', 'provider']
  },
  number: {
    type: Number
  },
  firstname: {
    type: String
  },
  secondname: {
    type: String
  },
  type: {
    type: String
  },
  service: {
    type: String
  },
  experience: {
    type: String
  },
  companyname: {
    type: String
  },
  bio:{
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 