import { useState, useEffect } from 'react';
import CourseList from '../components/CourseList';
import { courseAPI } from '../services/api';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAll();
      setCourses(response.data.courses);
    } catch (err) {
      setError('Failed to load courses.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Learn Without Limits</h1>
        <p style={styles.heroSubtitle}>
          Access world-class courses in programming, data science, and more.
          Start learning today!
        </p>
      </div>

      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Available Courses</h2>
        
        {loading ? (
          <p style={styles.message}>Loading courses...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : (
          <CourseList courses={courses} />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#f5f5f5'
  },
  hero: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: '60px 20px',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '2.5rem',
    margin: '0 0 16px 0'
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    color: '#aaa',
    maxWidth: '600px',
    margin: '0 auto'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#1a1a2e',
    margin: '0 0 20px 0'
  },
  message: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    color: '#e94560'
  }
};

export default Home;
