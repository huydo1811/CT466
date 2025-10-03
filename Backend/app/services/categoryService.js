import Category from '../models/Category.js';

class CategoryService {
  // Lấy tất cả thể loại
  async getAllCategories(options = {}) {
    try {
      const { page = 1, limit = 20, search = '' } = options;
      
      const query = search 
        ? { name: { $regex: search, $options: 'i' } }
        : {};

      const skip = (page - 1) * limit;
      
      const categories = await Category.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Category.countDocuments(query);

      return {
        categories,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: Number(limit)
        }
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách thể loại: ${error.message}`);
    }
  }

  // Lấy thể loại theo ID
  async getCategoryById(id) {
    try {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error('Không tìm thấy thể loại');
      }
      return category;
    } catch (error) {
      throw new Error(`Lỗi khi lấy thông tin thể loại: ${error.message}`);
    }
  }

  // Lấy thể loại theo slug
  async getCategoryBySlug(slug) {
    try {
      const category = await Category.findOne({ slug });
      if (!category) {
        throw new Error('Không tìm thấy thể loại');
      }
      return category;
    } catch (error) {
      throw new Error(`Lỗi khi lấy thông tin thể loại: ${error.message}`);
    }
  }

  // Tạo thể loại mới
  async createCategory(categoryData) {
    try {
      const existingCategory = await Category.findOne({ 
        name: { $regex: `^${categoryData.name}$`, $options: 'i' } 
      });
      
      if (existingCategory) {
        throw new Error('Tên thể loại đã tồn tại');
      }

      const category = await Category.create(categoryData);
      return category;
    } catch (error) {
      throw new Error(`Lỗi khi tạo thể loại: ${error.message}`);
    }
  }

  // Cập nhật thể loại
  async updateCategory(id, updateData) {
    try {
      if (updateData.name) {
        const existingCategory = await Category.findOne({ 
          name: { $regex: `^${updateData.name}$`, $options: 'i' },
          _id: { $ne: id }
        });
        
        if (existingCategory) {
          throw new Error('Tên thể loại đã tồn tại');
        }
      }

      const category = await Category.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!category) {
        throw new Error('Không tìm thấy thể loại');
      }

      return category;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật thể loại: ${error.message}`);
    }
  }

  // Xóa thể loại
  async deleteCategory(id) {
    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        throw new Error('Không tìm thấy thể loại');
      }
      return category;
    } catch (error) {
      throw new Error(`Lỗi khi xóa thể loại: ${error.message}`);
    }
  }

  // Tìm kiếm thể loại
  async searchCategories(searchTerm) {
    try {
      const categories = await Category.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      }).sort({ name: 1 });

      return categories;
    } catch (error) {
      throw new Error(`Lỗi khi tìm kiếm thể loại: ${error.message}`);
    }
  }
}

export default new CategoryService();