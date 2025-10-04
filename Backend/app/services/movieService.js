import Movie from '../models/Movie.js';

class MovieService {
  
  // Lấy tất cả phim với filter và phân trang
  async getAllMovies(options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        category,
        country,
        year,
        type,
        sortBy = 'createdAt',
        sortOrder = -1,
        isPublished = true
      } = options;
      
      const skip = (page - 1) * limit;
      let query = {};
      
      // Base filter
      if (isPublished !== undefined) {
        query.isPublished = isPublished;
      }
      
      // Search filter
      if (search) {
        query.$or = [
          { title: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { director: new RegExp(search, 'i') }
        ];
      }
      
      // Other filters
      if (category) query.categories = category;
      if (country) query.country = country;
      if (year) query.year = year;
      if (type) query.type = type;
      
      const movies = await Movie.find(query)
        .populate('categories', 'name slug')
        .populate('country', 'name code')
        .populate('actors', 'name avatar')
        .populate('createdBy', 'username fullName')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit));
      
      const total = await Movie.countDocuments(query);
      
      return {
        movies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách phim: ${error.message}`);
    }
  }
  
  // Lấy phim theo slug
  async getMovieBySlug(slug) {
    try {
      const movie = await Movie.findOne({ slug, isPublished: true })
        .populate('categories', 'name slug description')
        .populate('country', 'name code')
        .populate('actors', 'name avatar')
        .populate('createdBy', 'username fullName');
      
      if (!movie) {
        throw new Error('Phim không tồn tại hoặc đã bị ẩn');
      }
      
      return movie;
    } catch (error) {
      throw new Error(`Lỗi khi lấy thông tin phim: ${error.message}`);
    }
  }
  
  // Lấy phim theo ID (admin)
  async getMovieById(id) {
    try {
      const movie = await Movie.findById(id)
        .populate('categories country actors createdBy');
      
      if (!movie) {
        throw new Error('Phim không tồn tại');
      }
      
      return movie;
    } catch (error) {
      throw new Error(`Lỗi khi lấy phim: ${error.message}`);
    }
  }
  
  // Tạo phim mới
  async createMovie(movieData, userId) {
    try {
      movieData.createdBy = userId;
      
      const movie = await Movie.create(movieData);
      
      return await this.getMovieById(movie._id);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Slug phim đã tồn tại');
      }
      throw new Error(`Lỗi khi tạo phim: ${error.message}`);
    }
  }
  
  // Cập nhật phim
  async updateMovie(id, movieData, userId) {
    try {
      const movie = await Movie.findByIdAndUpdate(
        id,
        movieData,
        { new: true, runValidators: true }
      ).populate('categories country actors');
      
      if (!movie) {
        throw new Error('Phim không tồn tại');
      }
      
      return movie;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật phim: ${error.message}`);
    }
  }
  
  // Xóa phim
  async deleteMovie(id) {
    try {
      const movie = await Movie.findByIdAndDelete(id);
      
      if (!movie) {
        throw new Error('Phim không tồn tại');
      }
      
      return movie;
    } catch (error) {
      throw new Error(`Lỗi khi xóa phim: ${error.message}`);
    }
  }
  
  // Toggle publish status
  async togglePublishStatus(id) {
    try {
      const movie = await Movie.findById(id);
      
      if (!movie) {
        throw new Error('Phim không tồn tại');
      }
      
      movie.isPublished = !movie.isPublished;
      await movie.save();
      
      return movie;
    } catch (error) {
      throw new Error(`Lỗi khi thay đổi trạng thái phim: ${error.message}`);
    }
  }
  
  // Lấy phim nổi bật
  async getFeaturedMovies(limit = 10) {
    try {
      const movies = await Movie.find({ 
        isPublished: true, 
        isFeatured: true 
      })
        .populate('categories', 'name slug')
        .populate('country', 'name code')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));
      
      return movies;
    } catch (error) {
      throw new Error(`Lỗi khi lấy phim nổi bật: ${error.message}`);
    }
  }
  
  // Lấy phim mới nhất
  async getLatestMovies(limit = 20) {
    try {
      const movies = await Movie.find({ isPublished: true })
        .populate('categories', 'name slug')
        .populate('country', 'name code')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));
      
      return movies;
    } catch (error) {
      throw new Error(`Lỗi khi lấy phim mới nhất: ${error.message}`);
    }
  }
  
  // Lấy phim hot (nhiều view + rating cao)
  async getHotMovies(limit = 20) {
    try {
      const movies = await Movie.find({ 
        isPublished: true,
        isHot: true
      })
        .populate('categories', 'name slug')
        .populate('country', 'name code')
        .sort({ viewCount: -1, 'rating.average': -1 })
        .limit(parseInt(limit));
      
      return movies;
    } catch (error) {
      throw new Error(`Lỗi khi lấy phim hot: ${error.message}`);
    }
  }
  
  // Tăng view count
  async incrementView(id) {
    try {
      const movie = await Movie.findById(id);
      
      if (!movie || !movie.isPublished) {
        throw new Error('Phim không tồn tại hoặc chưa được xuất bản');
      }
      
      await movie.incrementView();
      return movie;
    } catch (error) {
      throw new Error(`Lỗi khi tăng view count: ${error.message}`);
    }
  }
  
  // Thống kê phim (admin)
  async getMovieStats() {
    try {
      const stats = await Movie.aggregate([
        {
          $group: {
            _id: null,
            totalMovies: { $sum: 1 },
            publishedMovies: {
              $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
            },
            featuredMovies: {
              $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
            },
            hotMovies: {
              $sum: { $cond: [{ $eq: ['$isHot', true] }, 1, 0] }
            },
            totalViews: { $sum: '$viewCount' },
            averageRating: { $avg: '$rating.average' }
          }
        }
      ]);
      
      const typeStats = await Movie.aggregate([
        { $match: { isPublished: true } },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalViews: { $sum: '$viewCount' },
            averageRating: { $avg: '$rating.average' }
          }
        }
      ]);
      
      const yearStats = await Movie.aggregate([
        { $match: { isPublished: true } },
        {
          $group: {
            _id: '$year',
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 10 }
      ]);
      
      return {
        overview: stats[0] || {
          totalMovies: 0,
          publishedMovies: 0,
          featuredMovies: 0,
          hotMovies: 0,
          totalViews: 0,
          averageRating: 0
        },
        typeBreakdown: typeStats,
        yearBreakdown: yearStats
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy thống kê phim: ${error.message}`);
    }
  }
}

export default new MovieService();