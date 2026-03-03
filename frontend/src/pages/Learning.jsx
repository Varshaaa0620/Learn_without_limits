import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import LessonSidebar from '../components/LessonSidebar';
import ProgressBar from '../components/ProgressBar';
import { courseAPI, lessonAPI, progressAPI } from '../services/api';

const Learning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState({
    percentage: 0,
    completed: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch lessons
      const lessonsRes = await courseAPI.getLessons(courseId);
      const fetchedLessons = lessonsRes.data.lessons;
      setLessons(fetchedLessons);

      // Set first lesson as current if none selected
      if (fetchedLessons.length > 0 && !currentLesson) {
        setCurrentLesson(fetchedLessons[0]);
      }

      // Fetch progress
      const progressRes = await progressAPI.getCourseProgress(courseId);
      setProgress({
        percentage: progressRes.data.progress_percentage,
        completed: progressRes.data.completed_lessons,
        total: progressRes.data.total_lessons
      });

      // Fetch completed lessons
      const completedRes = await progressAPI.getCompletedLessons(courseId);
      setCompletedLessons(completedRes.data.completed_lessons);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLesson = (lessonId) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
    }
  };

  const handleLessonComplete = async () => {
    if (!currentLesson || completedLessons.includes(currentLesson.id)) {
      return;
    }

    try {
      await progressAPI.markComplete(currentLesson.id);
      
      // Update completed lessons
      setCompletedLessons([...completedLessons, currentLesson.id]);
      
      // Refresh progress
      const progressRes = await progressAPI.getCourseProgress(courseId);
      setProgress({
        percentage: progressRes.data.progress_percentage,
        completed: progressRes.data.completed_lessons,
        total: progressRes.data.total_lessons
      });
    } catch (err) {
      console.error('Error marking lesson complete:', err);
    }
  };

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === currentLesson?.id);
    if (currentIndex < lessons.length - 1) {
      setCurrentLesson(lessons[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === currentLesson?.id);
    if (currentIndex > 0) {
      setCurrentLesson(lessons[currentIndex - 1]);
    }
  };

  if (loading) {
    return <div style={styles.container}><p>Loading...</p></div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  const currentIndex = lessons.findIndex(l => l.id === currentLesson?.id);
  const isFirstLesson = currentIndex === 0;
  const isLastLesson = currentIndex === lessons.length - 1;

  return (
    <div style={styles.container}>
      <ProgressBar 
        percentage={progress.percentage}
        completed={progress.completed}
        total={progress.total}
      />

      <div style={styles.content}>
        <div style={styles.main}>
          {currentLesson && (
            <>
              <div style={styles.videoSection}>
                <VideoPlayer 
                  youtubeUrl={currentLesson.youtube_url}
                  onComplete={handleLessonComplete}
                />
              </div>

              <div style={styles.lessonInfo}>
                <h2 style={styles.lessonTitle}>{currentLesson.title}</h2>
                <p style={styles.sectionName}>{currentLesson.section_title}</p>
              </div>

              <div style={styles.navigation}>
                <button
                  onClick={handlePrevLesson}
                  disabled={isFirstLesson}
                  style={{
                    ...styles.navButton,
                    ...(isFirstLesson ? styles.disabledButton : {})
                  }}
                >
                  ← Previous
                </button>

                {completedLessons.includes(currentLesson.id) ? (
                  <span style={styles.completedBadge}>✓ Completed</span>
                ) : (
                  <button
                    onClick={handleLessonComplete}
                    style={styles.completeButton}
                  >
                    Mark as Complete
                  </button>
                )}

                <button
                  onClick={handleNextLesson}
                  disabled={isLastLesson}
                  style={{
                    ...styles.navButton,
                    ...(isLastLesson ? styles.disabledButton : {})
                  }}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>

        <div style={styles.sidebar}>
          <LessonSidebar
            lessons={lessons}
            currentLessonId={currentLesson?.id}
            completedLessons={completedLessons}
            onSelectLesson={handleSelectLesson}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px'
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  videoSection: {
    backgroundColor: '#000',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  lessonInfo: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px'
  },
  lessonTitle: {
    margin: '0 0 8px 0',
    fontSize: '1.4rem',
    color: '#1a1a2e'
  },
  sectionName: {
    margin: 0,
    color: '#666',
    fontSize: '0.95rem'
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px 20px'
  },
  navButton: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem'
  },
  disabledButton: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  },
  completeButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '10px 24px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  completedBadge: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: '4px',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  sidebar: {
    minWidth: '300px'
  },
  error: {
    color: '#e94560',
    textAlign: 'center',
    padding: '40px'
  }
};

export default Learning;
