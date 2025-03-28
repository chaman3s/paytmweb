const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const fDSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  mobileNo: {
    type: String,
    required: true
  },
  upid: {
    type: String,
    required: true
  },
  lockbalance: {
    type: Number,
    default: 0
  },
  entries: [
    {
      transactionId: { type: String, default: uuidv4 },
      transactionType: { type: String, enum: ["Credit", "Debit"], required: true },
      referenceNo: { type: String, default: uuidv4 },
      amount: { type: Number, required: true },
      paymentMode: { type: String, enum: ["wallet", "UPI", "bank"], required: true },
      status: { type: String, enum: ["success", "failed"] },
      description: { type: String, required: true },
      valueDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
      postData: { type: String, default: () => new Date().toISOString().split('T')[0] },
      currency: { type: String, default: "INR" }
    }
  ],
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  interestRate: { type: Number, required: true },
  period: { type: Number, required: true }, // Duration (e.g., in months)
  balance: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('FD', fDSchema);
