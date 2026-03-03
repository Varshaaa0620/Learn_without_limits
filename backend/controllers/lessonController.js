const { Lesson, Section, Progress, Course, Enrollment } = require('../models');

const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const lesson = await Lesson.findByPk(id, {
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

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      where: { 
        user_id: userId, 
        course_id: lesson.section.course_id 
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must enroll in this course to access lessons.' });
    }

    // Get lesson progress
    const progress = await Progress.findOne({
      where: { user_id: userId, lesson_id: id }
    });

    res.json({
      lesson: {
        id: lesson.id,
        title: lesson.title,
        youtube_url: lesson.youtube_url,
        duration: lesson.duration,
        order_number: lesson.order_number,
        section_title: lesson.section.title,
        course_title: lesson.section.course.title
      },
      progress: progress ? progress.status : 'in_progress'
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ message: 'Server error fetching lesson.' });
  }
};

const getAdjacentLessons = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const currentLesson = await Lesson.findByPk(id, {
      include: [
        {
          model: Section,
          as: 'section',
          include: [
            {
              model: Course,
              as: 'course',
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
            }
          ]
        }
      ]
    });

    if (!currentLesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      where: { 
        user_id: userId, 
        course_id: currentLesson.section.course_id 
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must enroll in this course.' });
    }

    // Flatten all lessons and sort
    const allLessons = [];
    currentLesson.section.course.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        allLessons.push({
          id: lesson.id,
          order_number: lesson.order_number,
          section_order: section.order_number
        });
      });
    });

    allLessons.sort((a, b) => {
      if (a.section_order !== b.section_order) {
        return a.section_order - b.section_order;
      }
      return a.order_number - b.order_number;
    });

    const currentIndex = allLessons.findIndex(l => l.id === parseInt(id));
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    res.json({
      prev_lesson: prevLesson,
      next_lesson: nextLesson
    });
  } catch (error) {
    console.error('Get adjacent lessons error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getLessonById,
  getAdjacentLessons
};
