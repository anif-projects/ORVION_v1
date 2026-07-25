const Course = require('../models/Course');

class CourseRepository {
  async findPublished(filters = {}, pagination = { page: 1, limit: 12 }, sort = { createdAt: -1 }) {
    const skip = (pagination.page - 1) * pagination.limit;
    const query = { ...filters };

    // Since we don't have tags or category relations in the simplified schema,
    // we query courses directly and ignore relation populates.
    const courses = await Course.find(query)
      .skip(skip)
      .limit(pagination.limit)
      .sort(sort);

    const total = await Course.countDocuments(query);
    return { courses, total, page: pagination.page, pages: Math.ceil(total / pagination.limit) };
  }

  async findBySlug(id) {
    // Treat the slug parameter as the ID in the simplified schema
    const course = await Course.findById(id);
    if (!course) return null;
    return course.toObject();
  }

  async create(courseData) {
    return await Course.create(courseData);
  }

  async update(id, updateData) {
    return await Course.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Course.findByIdAndDelete(id);
  }
}

module.exports = new CourseRepository();
