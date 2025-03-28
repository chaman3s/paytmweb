const mongoose = require('mongoose');
const { boolean } = require('zod');

const UserSchema = new mongoose.Schema({
  logo:{
    type: String,
  },
  username: 
  {
   type: String,
   unique: true
   
 },
  fullname: {
    type: String,
    required: true,
  },
 
  password: {
    type: String,
    required: true,
  },
  upId:{
    type: String,
    required: true,
    unique: true,
  },
  bankname:{
    type: String,
    required: true,
  },
Locations:{
  type: String,
},
  mobileNo: { type: String, required: true, unique: true  ,default:""},
contect:{ type:Array,
  default: [],
}
  
});

module.exports = mongoose.model('User', UserSchema);
