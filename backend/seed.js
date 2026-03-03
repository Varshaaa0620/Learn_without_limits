const sequelize = require('./config/database');
const { User, Category, Course, Section, Lesson } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database synchronized.');

    // Create admin/instructor user
    const password_hash = await bcrypt.hash('admin123', 10);
    const instructor = await User.create({
      email: 'admin@lms.com',
      password_hash,
      full_name: 'Admin Instructor',
      role: 'admin'
    });
    console.log('Created instructor:', instructor.email);

    // Create categories
    const programmingCategory = await Category.create({
      name: 'Programming',
      description: 'Programming and software development courses'
    });
    console.log('Created category:', programmingCategory.name);

    // Create Java Course
    const javaCourse = await Course.create({
      title: 'Complete Java Programming',
      description: 'Master Java from basics to advanced concepts including OOP, data structures, and system design.',
      thumbnail_url: 'https://img.youtube.com/vi/SQykK40fFds/0.jpg',
      category_id: programmingCategory.id,
      instructor_id: instructor.id
    });
    console.log('Created course:', javaCourse.title);

    // Java Core Section
    const javaCoreSection = await Section.create({
      course_id: javaCourse.id,
      title: 'Core Java',
      order_number: 1
    });

    // Java Core Lessons
    await Lesson.bulkCreate([
      {
        section_id: javaCoreSection.id,
        title: 'Setup and Installation',
        order_number: 1,
        youtube_url: 'https://www.youtube.com/embed/SQykK40fFds',
        duration: '15:00'
      },
      {
        section_id: javaCoreSection.id,
        title: 'Variables and Data Types',
        order_number: 2,
        youtube_url: 'https://www.youtube.com/embed/X0zdAG7gfgs',
        duration: '20:00'
      },
      {
        section_id: javaCoreSection.id,
        title: 'Flow Statements',
        order_number: 3,
        youtube_url: 'https://www.youtube.com/embed/fGeE6JFqNU8',
        duration: '25:00'
      },
      {
        section_id: javaCoreSection.id,
        title: 'Object Oriented Programming',
        order_number: 4,
        youtube_url: 'https://www.youtube.com/embed/qay771mqKOk',
        duration: '30:00'
      },
      {
        section_id: javaCoreSection.id,
        title: 'Arrays and Collections',
        order_number: 5,
        youtube_url: 'https://www.youtube.com/embed/NTHVTY6w2Co',
        duration: '22:00'
      }
    ]);

    // Java Intermediate Section
    const javaIntermediateSection = await Section.create({
      course_id: javaCourse.id,
      title: 'Intermediate Java',
      order_number: 2
    });

    await Lesson.bulkCreate([
      {
        section_id: javaIntermediateSection.id,
        title: 'Advanced OOP Concepts',
        order_number: 1,
        youtube_url: 'https://www.youtube.com/embed/BSVKUk58K6U',
        duration: '28:00'
      },
      {
        section_id: javaIntermediateSection.id,
        title: 'Data Structures',
        order_number: 2,
        youtube_url: 'https://www.youtube.com/embed/4_HOnhB64Dg',
        duration: '35:00'
      },
      {
        section_id: javaIntermediateSection.id,
        title: 'Error Handling',
        order_number: 3,
        youtube_url: 'https://www.youtube.com/embed/1XAfa-pkBQjk',
        duration: '18:00'
      }
    ]);

    // Java Advanced Section
    const javaAdvancedSection = await Section.create({
      course_id: javaCourse.id,
      title: 'Advanced Java',
      order_number: 3
    });

    await Lesson.bulkCreate([
      {
        section_id: javaAdvancedSection.id,
        title: 'System Design',
        order_number: 1,
        youtube_url: 'https://www.youtube.com/embed/F2FmTdLtb_4',
        duration: '45:00'
      },
      {
        section_id: javaAdvancedSection.id,
        title: 'Concurrency and Threading',
        order_number: 2,
        youtube_url: 'https://www.youtube.com/embed/WIdMTtUWqTg',
        duration: '40:00'
      },
      {
        section_id: javaAdvancedSection.id,
        title: 'JVM Tuning',
        order_number: 3,
        youtube_url: 'https://www.youtube.com/embed/Hr0GmrSlqN4',
        duration: '32:00'
      },
      {
        section_id: javaAdvancedSection.id,
        title: 'Live Project',
        order_number: 4,
        youtube_url: 'https://www.youtube.com/embed/fmX84zu-5gs',
        duration: '60:00'
      }
    ]);

    // Create Python Course
    const pythonCourse = await Course.create({
      title: 'Complete Python Programming',
      description: 'Learn Python from scratch to advanced level including data science, web development, and automation.',
      thumbnail_url: 'https://img.youtube.com/vi/gCCVsvgR2KU/0.jpg',
      category_id: programmingCategory.id,
      instructor_id: instructor.id
    });
    console.log('Created course:', pythonCourse.title);

    // Python Core Section
    const pythonCoreSection = await Section.create({
      course_id: pythonCourse.id,
      title: 'Core Python',
      order_number: 1
    });

    await Lesson.bulkCreate([
      {
        section_id: pythonCoreSection.id,
        title: 'Data Types',
        order_number: 1,
        youtube_url: 'https://www.youtube.com/embed/gCCVsvgR2KU',
        duration: '18:00'
      },
      {
        section_id: pythonCoreSection.id,
        title: 'Control Statements',
        order_number: 2,
        youtube_url: 'https://www.youtube.com/embed/PqFKRqpHrjw',
        duration: '22:00'
      },
      {
        section_id: pythonCoreSection.id,
        title: 'Functions',
        order_number: 3,
        youtube_url: 'https://www.youtube.com/embed/BVfCWuca9nw',
        duration: '25:00'
      },
      {
        section_id: pythonCoreSection.id,
        title: 'Loops',
        order_number: 4,
        youtube_url: 'https://www.youtube.com/embed/0ZvaDa8eT5s',
        duration: '20:00'
      },
      {
        section_id: pythonCoreSection.id,
        title: 'Error Handling',
        order_number: 5,
        youtube_url: 'https://www.youtube.com/embed/K1n0YQlcPT0',
        duration: '15:00'
      }
    ]);

    // Python Intermediate Section
    const pythonIntermediateSection = await Section.create({
      course_id: pythonCourse.id,
      title: 'Intermediate Python',
      order_number: 2
    });

    await Lesson.bulkCreate([
      {
        section_id: pythonIntermediateSection.id,
        title: 'Object Oriented Programming',
        order_number: 1,
        youtube_url: 'https://www.youtube.com/embed/qiSCMNBIP2g',
        duration: '30:00'
      },
      {
        section_id: pythonIntermediateSection.id,
        title: 'Decorators',
        order_number: 2,
        youtube_url: 'https://www.youtube.com/embed/yNzxXZfkLUA',
        duration: '20:00'
      },
      {
        section_id: pythonIntermediateSection.id,
        title: 'Generators',
        order_number: 3,
        youtube_url: 'https://www.youtube.com/embed/mzilj4M_uwk',
        duration: '18:00'
      },
      {
        section_id: pythonIntermediateSection.id,
        title: 'List Comprehensions',
        order_number: 4,
        youtube_url: 'https://www.youtube.com/embed/fz2PKpPdlRo',
        duration: '15:00'
      },
      {
        section_id: pythonIntermediateSection.id,
        title: 'Exception Handling',
        order_number: 5,
        youtube_url: 'https://www.youtube.com/embed/6SPDvpK38tw',
        duration: '22:00'
      }
    ]);

    // Python Advanced Section
    const pythonAdvancedSection = await Section.create({
      course_id: pythonCourse.id,
      title: 'Advanced Python',
      order_number: 3
    });

    await Lesson.bulkCreate([
      {
        section_id: pythonAdvancedSection.id,
        title: 'Asynchronous Programming',
        order_number: 1,
        youtube_url: 'https://www.youtube.com/embed/oAkLSJNr5zY',
        duration: '35:00'
      },
      {
        section_id: pythonAdvancedSection.id,
        title: 'Meta Classes',
        order_number: 2,
        youtube_url: 'https://www.youtube.com/embed/NAQEj-c2CI8',
        duration: '28:00'
      },
      {
        section_id: pythonAdvancedSection.id,
        title: 'Live Project',
        order_number: 3,
        youtube_url: 'https://www.youtube.com/embed/dam0GPOAvVI',
        duration: '55:00'
      }
    ]);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
