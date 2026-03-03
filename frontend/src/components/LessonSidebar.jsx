const LessonSidebar = ({ 
  lessons, 
  currentLessonId, 
  completedLessons, 
  onSelectLesson 
}) => {
  // Group lessons by section
  const groupedLessons = lessons.reduce((acc, lesson) => {
    const sectionTitle = lesson.section_title || 'General';
    if (!acc[sectionTitle]) {
      acc[sectionTitle] = [];
    }
    acc[sectionTitle].push(lesson);
    return acc;
  }, {});

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.heading}>Course Content</h3>
      {Object.entries(groupedLessons).map(([sectionTitle, sectionLessons]) => (
        <div key={sectionTitle} style={styles.section}>
          <h4 style={styles.sectionTitle}>{sectionTitle}</h4>
          {sectionLessons.map((lesson) => {
            const isActive = lesson.id === currentLessonId;
            const isCompleted = completedLessons.includes(lesson.id);
            
            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                style={{
                  ...styles.lessonButton,
                  ...(isActive ? styles.activeLesson : {}),
                  ...(isCompleted ? styles.completedLesson : {})
                }}
              >
                <span style={styles.lessonNumber}>
                  {isCompleted ? '✓' : lesson.order_number}
                </span>
                <span style={styles.lessonTitle}>{lesson.title}</span>
                {lesson.duration && (
                  <span style={styles.duration}>{lesson.duration}</span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const styles = {
  sidebar: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    height: 'fit-content',
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto'
  },
  heading: {
    margin: '0 0 16px 0',
    fontSize: '1.2rem',
    color: '#1a1a2e'
  },
  section: {
    marginBottom: '16px'
  },
  sectionTitle: {
    margin: '0 0 8px 0',
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '600'
  },
  lessonButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderRadius: '4px',
    textAlign: 'left',
    transition: 'background-color 0.2s'
  },
  activeLesson: {
    backgroundColor: '#e94560',
    color: '#fff'
  },
  completedLesson: {
    color: '#28a745'
  },
  lessonNumber: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: '50%',
    fontSize: '0.8rem',
    fontWeight: 'bold'
  },
  lessonTitle: {
    flex: 1,
    fontSize: '0.9rem'
  },
  duration: {
    fontSize: '0.75rem',
    color: '#999'
  }
};

export default LessonSidebar;
