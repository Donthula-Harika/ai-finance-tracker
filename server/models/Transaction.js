import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  // userId: ObjectId, ref: 'User', required
  // type: String, enum: ['income', 'expense'], required
  // title: String, required
  // amount: Number, required, min: 0
  // category: String, required
  // paymentMethod: String, enum: ['cash','card','bank_transfer','upi','wallet','other'], default: 'card'
  // description: String, trim
  // transactionDate: Date, required, default: Date.now
  // createdAt: Date, default: Date.now
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0, 'Amount cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please select a category']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'upi', 'wallet', 'other'],
    default: 'card'
  },
  description: {
    type: String,
    trim: true
  },
  transactionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// index: { userId: 1, transactionDate: -1 }
// index: { userId: 1, type: 1 }
// index: { userId: 1, category: 1 }
transactionSchema.index({ userId: 1, transactionDate: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });

export default mongoose.model('Transaction', transactionSchema);