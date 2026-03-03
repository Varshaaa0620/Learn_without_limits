const { Progress, Lesson, Section, Course, Enrollment, sequelize } = require('../models');
const { Op } = require('sequelize');

const markLessonComplete = async (req, res) => {
  try {
    const { lesson_id } = req.body;
    const user_id = req.user.id;

    // Get lesson with course info
    const lesson = await Lesson.findByPk(lesson_id, {
      include: [
        {
          model: Section,
          as: 'section',
          include: [
            {
              model: Course,
              as: 'course'
            }
          ]
        }
      ]
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      where: { 
        user_id, 
        course_id: lesson.section.course_id 
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must enroll in this course.' });
    }

    // Update or create progress
    const [progress, created] = await Progress.findOrCreate({
      where: { user_id, lesson_id },
      defaults: {
        user_id,
        lesson_id,
        status: 'completed',
        completed_at: new Date()
      }
    });

    if (!created) {
      await progress.update({
        status: 'completed',
        completed_at: new Date()
      });
    }

    res.json({
      message: 'Lesson marked as completed.',
      progress
    });
  } catch (error) {
    console.error('Mark complete error:', error);
    res.status(500).json({ message: 'Server error updating progress.' });
  }
};

const getCourseProgress = async (req, res) => {
  try {
    const { course_id } = req.params;
    const user_id = req.user.id;

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      where: { user_id, course_id }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must enroll in this course.' });
    }

    // Get all lessons in the course
    const course = await Course.findByPk(course_id, {
      include: [
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Lesson,
              as: 'lessons'
            }
          ]
        }
      ]
    });

    const allLessonIds = [];
    course.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        allLessonIds.push(lesson.id);
      });
    });

    const totalLessons = allLessonIds.length;

    // Get completed lessons
    const completedProgress = await Progress.findAll({
      where: {
        user_id,
        lesson_id: { [Op.in]: allLessonIds },
        status: 'completed'
      }
    });

    const completedLessons = completedProgress.length;
    const progressPercentage = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100) 
      : 0;

    // Get last watched lesson
    const lastProgress = await Progress.findOne({
      where: { user_id },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          where: { id: { [Op.in]: allLessonIds } }
        }
      ],
      order: [['completed_at', 'DESC']]
    });

    res.json({
      course_id: parseInt(course_id),
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      progress_percentage: progressPercentage,
      last_watched_lesson: lastProgress ? lastProgress.lesson_id : null
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error fetching progress.' });
  }
};

const getCompletedLessons = async (req, res) => {
  try {
    const { course_id } = req.params;
    const user_id = req.user.id;

    // Get all lessons in the course
    const course = await Course.findByPk(course_id, {
      include: [
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Lesson,
              as: 'lessons'
            }
          ]
        }
      ]
    });

    const allLessonIds = [];
    course.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        allLessonIds.push(lesson.id);
      });
    });

    // Get completed lessons
    const completedProgress = await Progress.findAll({
      where: {
        user_id,
        lesson_id: { [Op.in]: allLessonIds },
        status: 'completed'
      }
    });

    const completedLessonIds = completedProgress.map(p => p.lesson_id);

    res.json({
      completed_lessons: completedLessonIds
    });
  } catch (error) {
    console.error('Get completed lessons error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  markLessonComplete,
  getCourseProgress,
  getCompletedLessons
};
