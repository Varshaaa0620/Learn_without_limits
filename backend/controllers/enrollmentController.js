const { Enrollment, Course, Section, Lesson, User } = require('../models');

const enrollInCourse = async (req, res) => {
  try {
    const { course_id } = req.body;
    const user_id = req.user.id;

    // Check if course exists
    const course = await Course.findByPk(course_id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: { user_id, course_id }
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }

    const enrollment = await Enrollment.create({
      user_id,
      course_id,
      status: 'active'
    });

    res.status(201).json({
      message: 'Successfully enrolled in course.',
      enrollment
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Server error during enrollment.' });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const user_id = req.user.id;

    const enrollments = await Enrollment.findAll({
      where: { user_id },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'full_name']
            }
          ]
        }
      ],
      order: [['enrolled_at', 'DESC']]
    });

    res.json({ enrollments });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ message: 'Server error fetching enrollments.' });
  }
};

const checkEnrollment = async (req, res) => {
  try {
    const { course_id } = req.params;
    const user_id = req.user.id;

    const enrollment = await Enrollment.findOne({
      where: { user_id, course_id }
    });

    res.json({
      is_enrolled: !!enrollment,
      enrollment: enrollment || null
    });
  } catch (error) {
    console.error('Check enrollment error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollment
};
