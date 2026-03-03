const { Course, Section, Lesson, User, Category, Enrollment, sequelize } = require('../models');
const { Op } = require('sequelize');

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'full_name']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error fetching courses.' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'full_name']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Lesson,
              as: 'lessons',
              attributes: ['id', 'title', 'order_number', 'duration']
            }
          ],
          order: [['order_number', 'ASC'], ['lessons', 'order_number', 'ASC']]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Calculate total lessons and duration
    let totalLessons = 0;
    course.sections.forEach(section => {
      totalLessons += section.lessons.length;
    });

    const courseData = {
      ...course.toJSON(),
      total_lessons: totalLessons
    };

    res.json({ course: courseData });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error fetching course.' });
  }
};

const getCourseLessons = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      where: { user_id: userId, course_id: id }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must enroll in this course to access lessons.' });
    }

    const course = await Course.findByPk(id, {
      include: [
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Lesson,
              as: 'lessons',
              order: [['order_number', 'ASC']]
            }
          ],
          order: [['order_number', 'ASC']]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Get user's progress for this course
    const lessons = [];
    course.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        lessons.push({
          id: lesson.id,
          title: lesson.title,
          order_number: lesson.order_number,
          youtube_url: lesson.youtube_url,
          duration: lesson.duration,
          section_title: section.title,
          section_order: section.order_number
        });
      });
    });

    // Sort by section order and lesson order
    lessons.sort((a, b) => {
      if (a.section_order !== b.section_order) {
        return a.section_order - b.section_order;
      }
      return a.order_number - b.order_number;
    });

    res.json({ lessons });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ message: 'Server error fetching lessons.' });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail_url, category_id } = req.body;
    const instructor_id = req.user.id;

    const course = await Course.create({
      title,
      description,
      thumbnail_url,
      category_id,
      instructor_id
    });

    res.status(201).json({
      message: 'Course created successfully.',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error creating course.' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  getCourseLessons,
  createCourse
};
