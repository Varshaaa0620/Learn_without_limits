import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Link to={`/course/${course.id}`} style={styles.card}>
      <div style={styles.imageContainer}>
        <img 
          src={course.thumbnail_url || 'https://via.placeholder.com/300x180'} 
          alt={course.title}
          style={styles.image}
        />
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{course.title}</h3>
        <p style={styles.category}>{course.category?.name || 'Programming'}</p>
        <p style={styles.instructor}>By {course.instructor?.full_name}</p>
      </div>
    </Link>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'block'
  },
  imageContainer: {
    width: '100%',
    height: '180px',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  content: {
    padding: '16px'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '1.1rem',
    color: '#1a1a2e'
  },
  category: {
    margin: '0 0 4px 0',
    color: '#e94560',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  instructor: {
    margin: 0,
    color: '#666',
    fontSize: '0.85rem'
  }
};

export default CourseCard;
