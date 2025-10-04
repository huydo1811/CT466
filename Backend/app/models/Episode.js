import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: [true, 'Tên tập phim là bắt buộc'],
    trim: true,
    maxlength: [200, 'Tên tập không được vượt quá 200 ký tự']
  },
  slug: {
    type: String,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Mô tả không được vượt quá 500 ký tự']
  },
  
  // Episode Info
  episodeNumber: {
    type: Number,
    required: [true, 'Số tập là bắt buộc'],
    min: [1, 'Số tập phải lớn hơn 0']
  },
  season: {
    type: Number,
    required: [true, 'Số mùa là bắt buộc'],
    min: [1, 'Số mùa phải lớn hơn 0'],
    default: 1
  },
  
  // Reference to Movie/Series
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Phim/Series là bắt buộc']
  },
  
  // Media
  duration: {
    type: Number, // Duration in minutes
    required: [true, 'Thời lượng tập phim là bắt buộc'],
    min: [1, 'Thời lượng phải lớn hơn 0']
  },
  videoUrl: {
    type: String,
    required: [true, 'Link video là bắt buộc']
  },
  
  // Release Info
  airDate: {
    type: Date,
    required: [true, 'Ngày phát sóng là bắt buộc']
  },
  
  // Status
  isPublished: {
    type: Boolean,
    default: true
  },
  
  // Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  
  // Admin Info
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Indexes
episodeSchema.index({ movie: 1, season: 1, episodeNumber: 1 }, { unique: true });
episodeSchema.index({ slug: 1 });

// Virtual fields
episodeSchema.virtual('episodeTitle').get(function() {
  return `S${this.season}E${this.episodeNumber}: ${this.title}`;
});

// Pre-save middleware - Auto slug
episodeSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = `s${this.season}e${this.episodeNumber}-${this.title}`
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

export default mongoose.model('Episode', episodeSchema);