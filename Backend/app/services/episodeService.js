import Episode from '../models/Episode.js';
import Movie from '../models/Movie.js';

class EpisodeService {
  
  // Lấy episodes của một series
  async getEpisodesByMovie(movieId, season = null) {
    try {
      let query = { movie: movieId, isPublished: true };
      if (season) query.season = season;
      
      const episodes = await Episode.find(query)
        .populate('movie', 'title')
        .sort({ season: 1, episodeNumber: 1 });
      
      return episodes;
    } catch (error) {
      throw new Error(`Lỗi khi lấy episodes: ${error.message}`);
    }
  }
  
  // Lấy episode theo slug
  async getEpisodeBySlug(slug) {
    try {
      const episode = await Episode.findOne({ slug, isPublished: true })
        .populate('movie', 'title poster categories');
      
      if (!episode) {
        throw new Error('Episode không tồn tại');
      }
      
      return episode;
    } catch (error) {
      throw new Error(`Lỗi khi lấy episode: ${error.message}`);
    }
  }
  
  // Lấy episode theo ID
  async getEpisodeById(id) {
    try {
      const episode = await Episode.findById(id).populate('movie');
      if (!episode) {
        throw new Error('Episode không tồn tại');
      }
      return episode;
    } catch (error) {
      throw new Error(`Lỗi khi lấy episode: ${error.message}`);
    }
  }
  
  // Tạo episode mới
  async createEpisode(episodeData, userId) {
    try {
      // Kiểm tra movie tồn tại
      const movie = await Movie.findById(episodeData.movie);
      if (!movie) {
        throw new Error('Movie/Series không tồn tại');
      }
      
      // Kiểm tra episode đã tồn tại chưa
      const existingEpisode = await Episode.findOne({
        movie: episodeData.movie,
        season: episodeData.season,
        episodeNumber: episodeData.episodeNumber
      });
      
      if (existingEpisode) {
        throw new Error(`Episode S${episodeData.season}E${episodeData.episodeNumber} đã tồn tại`);
      }
      
      episodeData.createdBy = userId;
      const episode = await Episode.create(episodeData);
      
      return await this.getEpisodeById(episode._id);
    } catch (error) {
      throw new Error(`Lỗi khi tạo episode: ${error.message}`);
    }
  }
  
  // Cập nhật episode
  async updateEpisode(id, episodeData, userId) {
    try {
      const episode = await Episode.findByIdAndUpdate(
        id,
        episodeData,
        { new: true, runValidators: true }
      ).populate('movie');
      
      if (!episode) {
        throw new Error('Episode không tồn tại');
      }
      
      return episode;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật episode: ${error.message}`);
    }
  }
  
  // Xóa episode
  async deleteEpisode(id) {
    try {
      const episode = await Episode.findByIdAndDelete(id);
      if (!episode) {
        throw new Error('Episode không tồn tại');
      }
      return episode;
    } catch (error) {
      throw new Error(`Lỗi khi xóa episode: ${error.message}`);
    }
  }
  
  // Tăng view count
  async incrementView(id) {
    try {
      const episode = await Episode.findByIdAndUpdate(
        id,
        { $inc: { viewCount: 1 } },
        { new: true }
      );
      
      if (!episode) {
        throw new Error('Episode không tồn tại');
      }
      
      return episode;
    } catch (error) {
      throw new Error(`Lỗi khi tăng view count: ${error.message}`);
    }
  }
}

export default new EpisodeService();