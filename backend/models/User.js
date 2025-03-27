const mongoose = require('mongoose');
const { boolean } = require('zod');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    
  },
  username: {
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  number: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', UserSchema);
