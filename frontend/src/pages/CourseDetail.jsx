import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, enrollmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const courseRes = await courseAPI.getById(id);
      setCourse(courseRes.data.course);

      if (isAuthenticated) {
        try {
          const enrollRes = await enrollmentAPI.checkEnrollment(id);
          setIsEnrolled(enrollRes.data.is_enrolled);
        } catch (err) {
          console.error('Error checking enrollment:', err);
        }
      }
    } catch (err) {
      setError('Failed to load course details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/course/${id}` } } });
      return;
    }

    try {
      setEnrolling(true);
      await enrollmentAPI.enroll(id);
      setIsEnrolled(true);
      // Redirect to learning page
      navigate(`/learn/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleContinue = () => {
    navigate(`/learn/${id}`);
  };

  if (loading) {
    return <div style={styles.container}><p>Loading...</p></div>;
  }

  if (error || !course) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error || 'Course not found.'}</p>
      </div>
    );
  }

  // Calculate total lessons from sections
  let totalLessons = 0;
  course.sections?.forEach(section => {
    totalLessons += section.lessons?.length || 0;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <span style={styles.category}>{course.category?.name}</span>
          <h1 style={styles.title}>{course.title}</h1>
          <p style={styles.instructor}>
            Instructor: {course.instructor?.full_name}
          </p>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.main}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>About this Course</h2>
            <p style={styles.description}>{course.description}</p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Course Content</h2>
            <div style={styles.stats}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{course.sections?.length || 0}</span>
                <span style={styles.statLabel}>Sections</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{totalLessons}</span>
                <span style={styles.statLabel}>Lessons</span>
              </div>
            </div>

            {course.sections?.map((section, index) => (
              <div key={section.id} style={styles.sectionCard}>
                <h3 style={styles.sectionCardTitle}>
                  Section {index + 1}: {section.title}
                </h3>
                <ul style={styles.lessonList}>
                  {section.lessons?.map((lesson) => (
                    <li key={lesson.id} style={styles.lessonItem}>
                      {lesson.title}
                      {lesson.duration && (
                        <span style={styles.duration}>{lesson.duration}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.sidebar}>
          <div style={styles.enrollCard}>
            {isEnrolled ? (
              <>
                <p style={styles.enrolledText}>You are enrolled in this course!</p>
                <button onClick={handleContinue} style={styles.enrollButton}>
                  Continue Learning
                </button>
              </>
            ) : (
              <>
                <p style={styles.price}>Free</p>
                <button 
                  onClick={handleEnroll} 
                  style={styles.enrollButton}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
                {!isAuthenticated && (
                  <p style={styles.loginHint}>
                    You will be redirected to login
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: '40px 20px'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  category: {
    backgroundColor: '#e94560',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    textTransform: 'uppercase'
  },
  title: {
    fontSize: '2rem',
    margin: '16px 0 8px 0'
  },
  instructor: {
    color: '#aaa',
    margin: 0
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '40px'
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px'
  },
  sectionTitle: {
    margin: '0 0 16px 0',
    fontSize: '1.3rem',
    color: '#1a1a2e'
  },
  description: {
    color: '#555',
    lineHeight: '1.6'
  },
  stats: {
    display: 'flex',
    gap: '32px',
    marginBottom: '24px'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statNumber: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#e94560'
  },
  statLabel: {
    color: '#666',
    fontSize: '0.9rem'
  },
  sectionCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px'
  },
  sectionCardTitle: {
    margin: '0 0 12px 0',
    fontSize: '1rem',
    color: '#333'
  },
  lessonList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  lessonItem: {
    padding: '8px 0',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    color: '#555',
    fontSize: '0.9rem'
  },
  duration: {
    color: '#999',
    fontSize: '0.8rem'
  },
  sidebar: {
    position: 'sticky',
    top: '20px',
    height: 'fit-content'
  },
  enrollCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    textAlign: 'center'
  },
  price: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#28a745',
    margin: '0 0 16px 0'
  },
  enrollButton: {
    width: '100%',
    backgroundColor: '#e94560',
    color: '#fff',
    padding: '14px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  enrolledText: {
    color: '#28a745',
    fontWeight: '500',
    marginBottom: '16px'
  },
  loginHint: {
    color: '#666',
    fontSize: '0.85rem',
    marginTop: '12px'
  },
  error: {
    color: '#e94560',
    textAlign: 'center',
    padding: '40px'
  }
};

export default CourseDetail;
