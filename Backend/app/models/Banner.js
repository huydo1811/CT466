import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  image: { type: String, required: true },
  mobileImage: String,
  

  videoUrl: String,           // URL video quảng cáo (MP4, WebM, etc.)
  videoDuration: Number,      // Thời lượng video (giây)
  skipAfter: { type: Number, default: 5 }, // Cho phép bỏ qua sau X giây
  
  linkUrl: String,
  linkType: { 
    type: String, 
    enum: ['none', 'movie', 'category', 'external'], 
    default: 'none' 
  },
  targetId: mongoose.Schema.Types.ObjectId,
  position: { 
    type: String, 
    enum: ['hero', 'secondary', 'sidebar', 'footer', 'pre-roll'], 
    default: 'hero' 
  },
  priority: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  startDate: Date,
  endDate: Date,
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 }
}, { 
  timestamps: true 
});

export default mongoose.model('Banner', bannerSchema);