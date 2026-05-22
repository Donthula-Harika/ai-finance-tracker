import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  // name: String, required, trim
  // email: String, required, unique, lowercase, match: email regex
  // password: String, required, minlength: 6, select: false
  // createdAt: Date, default: Date.now
  // updatedAt: Date, default: Date.now
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// pre('save'): skip if password not modified
//              set updatedAt, genSalt(10), hash password → next()
// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.updatedAt = new Date();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});


// methods.matchPassword: bcrypt.compare(enteredPassword, this.password)
// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// index: { email: 1 }, unique
userSchema.index({ email: 1 }, { unique: true });


export default mongoose.model('User', userSchema);