const User = require('./User');
const Category = require('./Category');
const Course = require('./Course');
const Section = require('./Section');
const Lesson = require('./Lesson');
const Enrollment = require('./Enrollment');
const Progress = require('./Progress');

// Define relationships

// User (Instructor) -> Courses
User.hasMany(Course, { foreignKey: 'instructor_id', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'instructor_id', as: 'instructor' });

// Category -> Courses
Category.hasMany(Course, { foreignKey: 'category_id', as: 'courses' });
Course.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Course -> Sections
Course.hasMany(Section, { foreignKey: 'course_id', as: 'sections' });
Section.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Section -> Lessons
Section.hasMany(Lesson, { foreignKey: 'section_id', as: 'lessons' });
Lesson.belongsTo(Section, { foreignKey: 'section_id', as: 'section' });

// User -> Enrollments
User.hasMany(Enrollment, { foreignKey: 'user_id', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'user_id', as: 'student' });

// Course -> Enrollments
Course.hasMany(Enrollment, { foreignKey: 'course_id', as: 'enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// User -> Progress
User.hasMany(Progress, { foreignKey: 'user_id', as: 'progress' });
Progress.belongsTo(User, { foreignKey: 'user_id', as: 'student' });

// Lesson -> Progress
Lesson.hasMany(Progress, { foreignKey: 'lesson_id', as: 'progressRecords' });
Progress.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

module.exports = {
  User,
  Category,
  Course,
  Section,
  Lesson,
  Enrollment,
  Progress
};
