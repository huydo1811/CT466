import mongoose from 'mongoose';
import Actor from '../models/Actor.js';

class ActorService {
  // Lấy tất cả diễn viên
  async getAllActors(options = {}) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search = '', 
        nationality = '', 
        isActive 
      } = options;
      
      // Tạo query tìm kiếm
      let query = {};
      
      // Tìm kiếm theo tên hoặc bio
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { bio: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Lọc theo quốc tịch
      if (nationality) {
        query.nationality = { $regex: nationality, $options: 'i' };
      }
      
      // Lọc theo trạng thái
      if (isActive !== undefined) {
        query.isActive = isActive === 'true';
      }

      const skip = (page - 1) * limit;
      
      const actors = await Actor.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Actor.countDocuments(query);

      return {
        actors,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: Number(limit)
        }
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách diễn viên: ${error.message}`);
    }
  }

  // Lấy diễn viên theo ID
  async getActorById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID không hợp lệ');
      }

      const actor = await Actor.findById(id);
      if (!actor) {
        throw new Error('Không tìm thấy diễn viên');
      }
      return actor;
    } catch (error) {
      throw new Error(`Lỗi khi lấy thông tin diễn viên: ${error.message}`);
    }
  }

  // Tạo diễn viên mới
  async createActor(actorData) {
    try {
      // Kiểm tra tên diễn viên đã tồn tại
      const existingActor = await Actor.findOne({ 
        name: { $regex: `^${actorData.name}$`, $options: 'i' } 
      });
      
      if (existingActor) {
        throw new Error('Tên diễn viên đã tồn tại');
      }

      const actor = await Actor.create(actorData);
      return actor;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(e => e.message);
        throw new Error(`Dữ liệu không hợp lệ: ${errors.join(', ')}`);
      }
      throw new Error(`Lỗi khi tạo diễn viên: ${error.message}`);
    }
  }

  // Cập nhật diễn viên
  async updateActor(id, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID không hợp lệ');
      }

      // Kiểm tra tên diễn viên đã tồn tại (ngoại trừ diễn viên hiện tại)
      if (updateData.name) {
        const existingActor = await Actor.findOne({ 
          name: { $regex: `^${updateData.name}$`, $options: 'i' },
          _id: { $ne: id }
        });
        
        if (existingActor) {
          throw new Error('Tên diễn viên đã tồn tại');
        }
      }

      const actor = await Actor.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!actor) {
        throw new Error('Không tìm thấy diễn viên');
      }

      return actor;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(e => e.message);
        throw new Error(`Dữ liệu không hợp lệ: ${errors.join(', ')}`);
      }
      throw new Error(`Lỗi khi cập nhật diễn viên: ${error.message}`);
    }
  }

  // Xóa diễn viên (soft delete)
  async deleteActor(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID không hợp lệ');
      }

      // Soft delete: chỉ set isActive = false
      const actor = await Actor.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!actor) {
        throw new Error('Không tìm thấy diễn viên');
      }

      return actor;
    } catch (error) {
      throw new Error(`Lỗi khi xóa diễn viên: ${error.message}`);
    }
  }

  // Xóa vĩnh viễn
  async permanentDeleteActor(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID không hợp lệ');
      }

      const actor = await Actor.findByIdAndDelete(id);
      if (!actor) {
        throw new Error('Không tìm thấy diễn viên');
      }
      return actor;
    } catch (error) {
      throw new Error(`Lỗi khi xóa vĩnh viễn diễn viên: ${error.message}`);
    }
  }

  // Tìm kiếm diễn viên
  async searchActors(searchTerm) {
    try {
      const actors = await Actor.find({
        $and: [
          { isActive: true },
          {
            $or: [
              { name: { $regex: searchTerm, $options: 'i' } },
              { bio: { $regex: searchTerm, $options: 'i' } },
              { nationality: { $regex: searchTerm, $options: 'i' } }
            ]
          }
        ]
      }).sort({ name: 1 });

      return actors;
    } catch (error) {
      throw new Error(`Lỗi khi tìm kiếm diễn viên: ${error.message}`);
    }
  }

  // Lấy diễn viên theo quốc tịch
  async getActorsByNationality(nationality) {
    try {
      const actors = await Actor.find({
        nationality: { $regex: nationality, $options: 'i' },
        isActive: true
      }).sort({ name: 1 });

      return actors;
    } catch (error) {
      throw new Error(`Lỗi khi lấy diễn viên theo quốc tịch: ${error.message}`);
    }
  }
}

export default new ActorService();