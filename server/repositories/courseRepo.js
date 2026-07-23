const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');

class CourseRepository {
  async findPublished(filters = {}, pagination = { page: 1, limit: 12 }, sort = { createdAt: -1 }) {
    const skip = (pagination.page - 1) * pagination.limit;
    const query = { status: 'published', ...filters };
    
    const courses = await Course.find(query)
      .populate('category', 'name slug color icon')
      .populate('instructor', 'name avatar')
      .skip(skip)
      .limit(pagination.limit)
      .sort(sort);

    const total = await Course.countDocuments(query);
    return { courses, total, page: pagination.page, pages: Math.ceil(total / pagination.limit) };
  }

  async findBySlug(slug) {
    const course = await Course.findOne({ slug })
      .populate('category', 'name slug')
      .populate('instructor', 'name avatar');
    
    if (!course) return null;

    const modules = await Module.find({ course: course._id }).sort({ order: 1 });
    const moduleIds = modules.map((m) => m._id);
    const lessons = await Lesson.find({ module: { $in: moduleIds } }).sort({ order: 1 });

    const curriculum = modules.map((mod) => ({
      ...mod.toObject(),
      lessons: lessons.filter((les) => les.module.toString() === mod._id.toString()),
    }));

    return { ...course.toObject(), modules: curriculum };
  }

  async create(courseData) {
    return await Course.create(courseData);
  }

  async update(id, updateData) {
    return await Course.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    await Module.deleteMany({ course: id });
    await Lesson.deleteMany({ course: id });
    return await Course.findByIdAndDelete(id);
  }
}

module.exports = new CourseRepository();
