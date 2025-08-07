const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  currentBalance:{type:Number,required:true},
  transactionId: { type: String, default: () => Date.now().toString() },
  transactionType: { type: String, enum: ["Credit", "Debit"], required: true },
  referenceNo: { type: String, default: () => (Date.now() + 45678976542341232).toString() },
  amount: { type: Number, required: true },
  paymentMode: { type: String, enum: ["wallet", "UPI", "bank"], required: true },
  status: { type: String, enum: ["success", "failed"], required: true },
  description: { type: String, required: true },
  valueDate: { type: Date, default: () => new Date() },
  postData: { type: Date, default: () => new Date() },
  currency: { type: String, default: "INR" }
}, { _id: false });

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  username: { type: String, required: true, unique: true },
  mobileNo: { type: String, required: true, unique: true },
  upid: { type: String, required: true, unique: true },
  lockbalance: { type: Number, default: 0 },
  entries: [entrySchema],
  bankname: { type: String },
  account: { type: String, required: true },
  balance: { type: Number, required: true }
});

module.exports = mongoose.model('Account', accountSchema);