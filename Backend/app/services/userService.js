import mongoose from 'mongoose';
import User from '../models/User.js';

class UserService {
  // Lấy tất cả users (admin only)
  async getAllUsers(options = {}) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search = '', 
        role = '', 
        status = '' 
      } = options;
      
      let query = {};
      
      // Tìm kiếm theo username, email, fullName
      if (search) {
        query.$or = [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Lọc theo role
      if (role) {
        query.role = role;
      }
      
      // Lọc theo status
      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit;
      
      const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await User.countDocuments(query);

      return {
        users,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: Number(limit)
        }
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách users: ${error.message}`);
    }
  }

  // Lấy user theo ID
  async getUserById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID không hợp lệ');
      }

      const user = await User.findById(id);
      if (!user) {
        throw new Error('Không tìm thấy user');
      }
      return user;
    } catch (error) {
      throw new Error(`Lỗi khi lấy thông tin user: ${error.message}`);
    }
  }

  // Lấy user theo username
  async getUserByUsername(username) {
    try {
      const user = await User.findOne({ username: username.toLowerCase() });
      return user;
    } catch (error) {
      throw new Error(`Lỗi khi lấy user theo username: ${error.message}`);
    }
  }

  // Tạo user mới
  async createUser(userData) {
    try {
      // Kiểm tra username đã tồn tại
      const existingUser = await User.findOne({ 
        username: userData.username.toLowerCase() 
      });
      
      if (existingUser) {
        throw new Error('Tên đăng nhập đã được sử dụng');
      }

      // Kiểm tra email đã tồn tại (nếu có)
      if (userData.email) {
        const existingEmail = await User.findOne({ 
          email: userData.email.toLowerCase() 
        });
        
        if (existingEmail) {
          throw new Error('Email đã được sử dụng');
        }
      }

      // Tạo user mới
      const user = await User.create({
        ...userData,
        username: userData.username.toLowerCase(),
        email: userData.email ? userData.email.toLowerCase() : undefined
      });

      return user;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(e => e.message);
        throw new Error(`Dữ liệu không hợp lệ: ${errors.join(', ')}`);
      }
      throw new Error(`Lỗi khi tạo user: ${error.message}`);
    }
  }

  // Cập nhật user
  async updateUser(id, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID không hợp lệ');
      }

      // Không cho phép update password qua route này
      if (updateData.passwordHash) {
        delete updateData.passwordHash;
      }

      // Kiểm tra username đã tồn tại (ngoại trừ user hiện tại)
      if (updateData.username) {
        const existingUser = await User.findOne({ 
          username: updateData.username.toLowerCase(),
          _id: { $ne: id }
        });
        
        if (existingUser) {
          throw new Error('Tên đăng nhập đã được sử dụng');
        }
        
        updateData.username = updateData.username.toLowerCase();
      }

      // Kiểm tra email đã tồn tại (ngoại trừ user hiện tại)
      if (updateData.email) {
        const existingEmail = await User.findOne({ 
          email: updateData.email.toLowerCase(),
          _id: { $ne: id }
        });
        
        if (existingEmail) {
          throw new Error('Email đã được sử dụng');
        }
        
        updateData.email = updateData.email.toLowerCase();
      }

      const user = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('Không tìm thấy user');
      }

      return user;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(e => e.message);
        throw new Error(`Dữ liệu không hợp lệ: ${errors.join(', ')}`);
      }
      throw new Error(`Lỗi khi cập nhật user: ${error.message}`);
    }
  }

  // Ban user
  async banUser(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID không hợp lệ');
      }

      const user = await User.findByIdAndUpdate(
        id,
        { status: 'banned' },
        { new: true }
      );

      if (!user) {
        throw new Error('Không tìm thấy user');
      }

      return user;
    } catch (error) {
      throw new Error(`Lỗi khi ban user: ${error.message}`);
    }
  }

  // Unban user
  async unbanUser(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID không hợp lệ');
      }

      const user = await User.findByIdAndUpdate(
        id,
        { status: 'active' },
        { new: true }
      );

      if (!user) {
        throw new Error('Không tìm thấy user');
      }

      return user;
    } catch (error) {
      throw new Error(`Lỗi khi unban user: ${error.message}`);
    }
  }

  // Đổi role user
  async changeUserRole(id, newRole) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID không hợp lệ');
      }

      if (!['user', 'admin'].includes(newRole)) {
        throw new Error('Role không hợp lệ');
      }

      const user = await User.findByIdAndUpdate(
        id,
        { role: newRole },
        { new: true }
      );

      if (!user) {
        throw new Error('Không tìm thấy user');
      }

      return user;
    } catch (error) {
      throw new Error(`Lỗi khi đổi role: ${error.message}`);
    }
  }

  // Tìm kiếm users
  async searchUsers(searchTerm) {
    try {
      const users = await User.find({
        $and: [
          { status: 'active' },
          {
            $or: [
              { username: { $regex: searchTerm, $options: 'i' } },
              { fullName: { $regex: searchTerm, $options: 'i' } },
              { email: { $regex: searchTerm, $options: 'i' } }
            ]
          }
        ]
      }).sort({ username: 1 });

      return users;
    } catch (error) {
      throw new Error(`Lỗi khi tìm kiếm users: ${error.message}`);
    }
  }

  // Thống kê users
  async getUserStats() {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ status: 'active' });
      const bannedUsers = await User.countDocuments({ status: 'banned' });
      const adminUsers = await User.countDocuments({ role: 'admin' });

      return {
        total: totalUsers,
        active: activeUsers,
        banned: bannedUsers,
        admins: adminUsers,
        regularUsers: totalUsers - adminUsers
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy thống kê users: ${error.message}`);
    }
  }
}

export default new UserService();