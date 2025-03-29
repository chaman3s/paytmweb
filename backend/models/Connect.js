const mongoose = require('mongoose');
const connectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    userRefferenceCode:{
        type: String,
        required: true,
        unique: true
    },
    Connection:{
        type :Array,
        default:[],
    }  
});


module.exports  = mongoose.model('ConnectionModel', connectionSchema);