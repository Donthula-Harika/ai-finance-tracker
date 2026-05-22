import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  // userId: ObjectId, ref: 'User', required, unique
  // monthlyBudget: Number, required, min: 0
  // categoryBudgets: [{ category: String (required), limit: Number (required, min: 0) }]
  // createdAt: Date, default: Date.now
  // updatedAt: Date, default: Date.now
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  monthlyBudget: {
    type: Number,
    required: [true, 'Please provide a monthly budget'],
    min: [0, 'Budget cannot be negative']
  },
  categoryBudgets: [
    {
      category: {
        type: String,
        required: true
      },
      limit: {
        type: Number,
        required: true,
        min: [0, 'Limit cannot be negative']
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});



export default mongoose.model('Budget', budgetSchema);