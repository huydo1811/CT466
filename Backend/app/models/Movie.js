import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tên phim là bắt buộc'],
    trim: true,
    maxlength: [200, 'Tên phim không được vượt quá 200 ký tự']
  },
  originalTitle: {
    type: String, // Tên gốc (tiếng Anh)
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Mô tả phim là bắt buộc'],
    maxlength: [2000, 'Mô tả không được vượt quá 2000 ký tự']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Mô tả ngắn không được vượt quá 500 ký tự']
  },
  
  // Media
  poster: {
    type: String,
    required: [true, 'Poster phim là bắt buộc']
  },
  backdrop: {
    type: String, // Hình nền lớn
  },
  trailer: {
    type: String, // Link YouTube trailer
  },
  
  // Categories & Classification
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: [true, 'Quốc gia sản xuất là bắt buộc']
  },
  language: {
    type: String,
    default: 'Tiếng Việt'
  },
  subtitle: {
    type: [String], // ['Tiếng Việt', 'English']
    default: ['Tiếng Việt']
  },
  
  // Cast & Crew
  actors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor'
  }],
  director: {
    type: String,
    required: [true, 'Đạo diễn là bắt buộc']
  },
  producer: {
    type: String
  },
  writer: {
    type: String
  },
  
  // Technical Info
  duration: {
    type: Number, // Phút
    required: [true, 'Thời lượng phim là bắt buộc'],
    min: [1, 'Thời lượng phải lớn hơn 0']
  },
  quality: {
    type: String,
    enum: ['HD', 'Full HD', '4K', 'CAM', 'TS'],
    default: 'HD'
  },
  resolution: {
    type: String,
    enum: ['720p', '1080p', '4K', '480p'],
    default: '1080p'
  },
  fileSize: {
    type: String // "1.2 GB"
  },
  
  // Release Info
  releaseDate: {
    type: Date,
    required: [true, 'Ngày phát hành là bắt buộc']
  },
  year: {
    type: Number,
    required: [true, 'Năm phát hành là bắt buộc'],
    min: [1900, 'Năm phải từ 1900 trở lên'],
    max: [new Date().getFullYear() + 2, 'Năm không được quá tương lai']
  },
  
  // Movie Type
  type: {
    type: String,
    enum: ['movie', 'series', 'documentary', 'anime'],
    default: 'movie'
  },
  status: {
    type: String,
    enum: ['upcoming', 'released', 'in_theaters', 'streaming'],
    default: 'released'
  },
  
  // Series Info (nếu là series)
  totalEpisodes: {
    type: Number,
    min: 1
  },
  currentEpisode: {
    type: Number,
    min: 1
  },
  season: {
    type: Number,
    min: 1
  },
  
  // Ratings & Stats
  imdbRating: {
    type: Number,
    min: 0,
    max: 10
  },
  imdbId: {
    type: String
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    breakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  
  // Content Rating
  ageRating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'K+', 'T13', 'T16', 'T18'],
    default: 'PG-13'
  },
  
  // Video Sources
  videoSources: [{
    quality: {
      type: String,
      enum: ['720p', '1080p', '4K', '480p']
    },
    url: {
      type: String,
      required: true
    },
    server: {
      type: String, // 'server1', 'server2', 'youtube'
      default: 'server1'
    },
    size: String // "1.2 GB"
  }],
  
  // SEO & Meta
  keywords: [String],
  tags: [String],
  metaTitle: String,
  metaDescription: String,
  
  // Visibility & Features
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isHot: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  
  // Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  favoriteCount: {
    type: Number,
    default: 0
  },
  
  // Admin fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes cho performance
movieSchema.index({ title: 'text', description: 'text' }); // Full-text search
movieSchema.index({ slug: 1 });
movieSchema.index({ year: -1, createdAt: -1 });
movieSchema.index({ categories: 1, isPublished: 1 });
movieSchema.index({ country: 1, isPublished: 1 });
movieSchema.index({ 'rating.average': -1 });
movieSchema.index({ viewCount: -1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ isFeatured: 1, isPublished: 1 });
movieSchema.index({ isHot: 1, isPublished: 1 });

// Virtual fields
movieSchema.virtual('durationFormatted').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

movieSchema.virtual('ratingStars').get(function() {
  return Math.round(this.rating.average);
});

// Pre-save middleware
movieSchema.pre('save', function(next) {
  // Tạo slug từ title
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Set year từ releaseDate
  if (this.isModified('releaseDate')) {
    this.year = new Date(this.releaseDate).getFullYear();
  }
  
  next();
});

// Static methods
movieSchema.statics.findPublished = function() {
  return this.find({ isPublished: true });
};

movieSchema.statics.findByCategory = function(categoryId) {
  return this.find({ 
    categories: categoryId, 
    isPublished: true 
  }).populate('categories country actors');
};

movieSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ 
    isFeatured: true, 
    isPublished: true 
  })
  .populate('categories country actors')
  .limit(limit)
  .sort({ createdAt: -1 });
};

movieSchema.statics.search = function(query, options = {}) {
  const {
    page = 1,
    limit = 20,
    category,
    country,
    year,
    quality,
    type,
    sortBy = 'createdAt',
    sortOrder = -1
  } = options;
  
  let filter = {
    isPublished: true,
    $or: [
      { title: new RegExp(query, 'i') },
      { originalTitle: new RegExp(query, 'i') },
      { description: new RegExp(query, 'i') },
      { director: new RegExp(query, 'i') },
      { keywords: { $in: [new RegExp(query, 'i')] } }
    ]
  };
  
  if (category) filter.categories = category;
  if (country) filter.country = country;
  if (year) filter.year = year;
  if (quality) filter.quality = quality;
  if (type) filter.type = type;
  
  return this.find(filter)
    .populate('categories country actors')
    .sort({ [sortBy]: sortOrder })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Instance methods
movieSchema.methods.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

movieSchema.methods.incrementDownload = function() {
  this.downloadCount += 1;
  return this.save();
};

movieSchema.methods.addRating = function(rating) {
  this.rating.breakdown[rating] += 1;
  this.rating.count += 1;
  
  // Tính lại average
  let total = 0;
  for (let i = 1; i <= 5; i++) {
    total += i * this.rating.breakdown[i];
  }
  this.rating.average = total / this.rating.count;
  
  return this.save();
};

export default mongoose.model('Movie', movieSchema);