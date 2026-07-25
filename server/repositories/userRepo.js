const User = require('../models/User');

class UserRepository {
  async findByEmail(email, selectPassword = false) {
    const query = User.findOne({ email });
    if (selectPassword) query.select('+password');
    return await query;
  }

  async findById(id) {
    return await User.findById(id);
  }

  async create(userData) {
    return await User.create(userData);
  }

  async updateStatus(id, status) {
    return await User.findByIdAndUpdate(id, { status }, { new: true });
  }

  async findAll(query = {}, pagination = { page: 1, limit: 10 }) {
    const skip = (pagination.page - 1) * pagination.limit;
    const users = await User.find(query)
      .skip(skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 });
    const total = await User.countDocuments(query);
    return { users, total, page: pagination.page, pages: Math.ceil(total / pagination.limit) };
  }
}

module.exports = new UserRepository();
