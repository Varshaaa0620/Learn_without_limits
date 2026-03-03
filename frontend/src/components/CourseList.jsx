import CourseCard from './CourseCard';

const CourseList = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return <p style={styles.noCourses}>No courses available.</p>;
  }

  return (
    <div style={styles.grid}>
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    padding: '20px 0'
  },
  noCourses: {
    textAlign: 'center',
    color: '#666',
    padding: '40px'
  }
};

export default CourseList;
