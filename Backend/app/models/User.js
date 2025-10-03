import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Tên đăng nhập là bắt buộc'],
    unique: true,
    trim: true,
    minlength: [6, 'Tên đăng nhập phải có ít nhất 6 ký tự'],
    maxlength: [30, 'Tên đăng nhập không được vượt quá 30 ký tự'],
    match: [/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới']
  },
  passwordHash: {
    type: String,
    required: function() {
      return !this.googleId; // Chỉ bắt buộc nếu không dùng OAuth
    },
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
  },

  // Thông tin từ OAuth (optional)
  email: {
    type: String,
    sparse: true, // Cho phép null, unique nếu có
    lowercase: true,
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'Họ tên là bắt buộc'],
    trim: true,
    maxlength: [100, 'Họ tên không được vượt quá 100 ký tự']
  },
  googleId: {
    type: String,
    sparse: true
  },
  avatar: {
    type: String,
    default: null
  },

  // Phân quyền đơn giản
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'banned'],
    default: 'active'
  },

  // Tracking
  lastLogin: { type: Date }
}, {
  timestamps: true,
  collection: 'users'
});

// Hide password (ẩn password khi trả về client)
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  return userObject;
};

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.passwordHash) return false;
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  if (!this.passwordHash) return next();
  
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

const User = mongoose.model('User', userSchema);

export default User;