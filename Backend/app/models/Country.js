import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên quốc gia là bắt buộc'],
    unique: true,
    trim: true,
    maxlength: [100, 'Tên quốc gia không được vượt quá 100 ký tự']
  }
}, {
  timestamps: true, // Tự động tạo createdAt và updatedAt
  collection: 'countries'
});

// Index để tìm kiếm nhanh
countrySchema.index({ name: 1 });

const Country = mongoose.model('Country', countrySchema);

export default Country;