const ProgressBar = ({ percentage, completed, total }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.label}>Course Progress</span>
        <span style={styles.percentage}>{percentage}%</span>
      </div>
      <div style={styles.barContainer}>
        <div 
          style={{
            ...styles.bar,
            width: `${percentage}%`
          }}
        />
      </div>
      <p style={styles.stats}>
        {completed} of {total} lessons completed
      </p>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px 20px',
    marginBottom: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  label: {
    fontWeight: '600',
    color: '#1a1a2e'
  },
  percentage: {
    fontWeight: 'bold',
    color: '#e94560'
  },
  barContainer: {
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  bar: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  stats: {
    margin: '8px 0 0 0',
    fontSize: '0.85rem',
    color: '#666'
  }
};

export default ProgressBar;
