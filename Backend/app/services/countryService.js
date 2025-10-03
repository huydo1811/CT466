import Country from '../models/Country.js';

class CountryService {
  // Lấy tất cả quốc gia
  async getAllCountries(options = {}) {
    try {
      const { page = 1, limit = 10, search = '' } = options;
      
      // Tạo query tìm kiếm
      const query = search 
        ? { name: { $regex: search, $options: 'i' } }
        : {};

      // Pagination
      const skip = (page - 1) * limit;
      
      const countries = await Country.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Country.countDocuments(query);

      return {
        countries,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: Number(limit)
        }
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách quốc gia: ${error.message}`);
    }
  }

  // Lấy quốc gia theo ID
  async getCountryById(id) {
    try {
      const country = await Country.findById(id);
      if (!country) {
        throw new Error('Không tìm thấy quốc gia');
      }
      return country;
    } catch (error) {
      throw new Error(`Lỗi khi lấy thông tin quốc gia: ${error.message}`);
    }
  }

  // Tạo quốc gia mới
  async createCountry(countryData) {
    try {
      // Kiểm tra tên quốc gia đã tồn tại
      const existingCountry = await Country.findOne({ 
        name: { $regex: `^${countryData.name}$`, $options: 'i' } 
      });
      
      if (existingCountry) {
        throw new Error('Tên quốc gia đã tồn tại');
      }

      const country = await Country.create(countryData);
      return country;
    } catch (error) {
      throw new Error(`Lỗi khi tạo quốc gia: ${error.message}`);
    }
  }

  // Cập nhật quốc gia
  async updateCountry(id, updateData) {
    try {
      // Kiểm tra tên quốc gia đã tồn tại (ngoại trừ quốc gia hiện tại)
      if (updateData.name) {
        const existingCountry = await Country.findOne({ 
          name: { $regex: `^${updateData.name}$`, $options: 'i' },
          _id: { $ne: id }
        });
        
        if (existingCountry) {
          throw new Error('Tên quốc gia đã tồn tại');
        }
      }

      const country = await Country.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!country) {
        throw new Error('Không tìm thấy quốc gia');
      }

      return country;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật quốc gia: ${error.message}`);
    }
  }

  // Xóa quốc gia
  async deleteCountry(id) {
    try {
      const country = await Country.findByIdAndDelete(id);
      if (!country) {
        throw new Error('Không tìm thấy quốc gia');
      }
      return country;
    } catch (error) {
      throw new Error(`Lỗi khi xóa quốc gia: ${error.message}`);
    }
  }

  // Tìm kiếm quốc gia theo tên
  async searchCountries(searchTerm) {
    try {
      const countries = await Country.find({
        name: { $regex: searchTerm, $options: 'i' }
      }).sort({ name: 1 });

      return countries;
    } catch (error) {
      throw new Error(`Lỗi khi tìm kiếm quốc gia: ${error.message}`);
    }
  }
}

export default new CountryService();