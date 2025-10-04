import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Reference relationships
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User là bắt buộc']
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie là bắt buộc']
  },
  
  // Rating & Review content
  rating: {
    type: Number,
    required: [true, 'Điểm đánh giá là bắt buộc'],
    min: [1, 'Điểm tối thiểu là 1 sao'],
    max: [5, 'Điểm tối đa là 5 sao']
  },
  comment: {
    type: String,
    maxlength: [1000, 'Bình luận không được vượt quá 1000 ký tự'],
    trim: true
  },
  
  // Review status
  isPublished: {
    type: Boolean,
    default: true
  },
  
  // Helpful votes (optional - for later)
  helpfulVotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Indexes
reviewSchema.index({ user: 1, movie: 1 }, { unique: true }); // 1 user chỉ review 1 movie 1 lần
reviewSchema.index({ movie: 1, createdAt: -1 }); // Lấy reviews theo movie
reviewSchema.index({ user: 1, createdAt: -1 }); // Lấy reviews của user
reviewSchema.index({ rating: -1 }); // Sort by rating

// Virtual field - Review summary
reviewSchema.virtual('ratingStars').get(function() {
  return '⭐'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
});

// Static methods
reviewSchema.statics.getMovieRatingStats = async function(movieId) {
  const stats = await this.aggregate([
    { $match: { movie: mongoose.Types.ObjectId(movieId), isPublished: true } },
    {
      $group: {
        _id: '$movie',
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        ratingBreakdown: {
          $push: '$rating'
        }
      }
    },
    {
      $addFields: {
        averageRating: { $round: ['$averageRating', 1] }
      }
    }
  ]);
  
  return stats[0] || { totalReviews: 0, averageRating: 0, ratingBreakdown: [] };
};

reviewSchema.statics.getUserReviewForMovie = async function(userId, movieId) {
  return await this.findOne({ 
    user: userId, 
    movie: movieId 
  }).populate('movie', 'title poster');
};

// Instance methods
reviewSchema.methods.updateHelpfulVotes = function(increment = true) {
  this.helpfulVotes += increment ? 1 : -1;
  return this.save();
};

export default mongoose.model('Review', reviewSchema);