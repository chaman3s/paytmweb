const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    mobileNo: {
        type:String,
        required: true,
        unique: true
    },
    upid:{
        type: String,
        required: true,
        unique: true
    },
    lockbalance:{
        type: Number,
        default: 0
    },
    entries:[ {
      transactionId: { type: String, default: () => Date.now().toString() },
      transactionType: { type: String, enum: ["Credit", "Debit"], required: true }, // ✅ Credit or Debit
      referenceNo: { type: String, default: () => (Date.now() + 45678976542341232).toString() },
      amount: { type: Number, required: true },
      paymentMode: { type: String, enum: ["wallet", "UPI", "bank"], required: true },
      status: { type: String, enum: ["success", "failed"], },
      description: { type: String, required: true },
      valueDate: { type: String, default: () => new Date().toLocaleDateString("en-GB") },
      postData: { type: String, default: () => new Date().toLocaleDateString("en-GB") },
      currency: { type: String, default: "INR" }
    }

    ],
bankname:{ type: String},
account:{ type: String, required: true},

    balance: {
        type: Number,
        required: true
    }
});


module.exports  = mongoose.model('Account', accountSchema);