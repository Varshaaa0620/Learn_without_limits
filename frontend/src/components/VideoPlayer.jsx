import { useEffect } from 'react';

const VideoPlayer = ({ youtubeUrl, onComplete }) => {
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url) => {
    if (!url) return null;
    
    // Handle embed URLs
    if (url.includes('/embed/')) {
      return url.split('/embed/')[1]?.split('?')[0];
    }
    
    // Handle watch URLs
    const match = url.match(/[?&]v=([^&]+)/);
    if (match) return match[1];
    
    // Handle youtu.be URLs
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) return shortMatch[1];
    
    return null;
  };

  const videoId = getVideoId(youtubeUrl);

  useEffect(() => {
    // Auto-mark complete after 80% of typical video duration
    // In a real app, you'd use YouTube API to track actual progress
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 30000); // 30 seconds for demo

    return () => clearTimeout(timer);
  }, [youtubeUrl, onComplete]);

  if (!videoId) {
    return <div style={styles.error}>Invalid video URL</div>;
  }

  return (
    <div style={styles.container}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        title="Course Video"
        style={styles.iframe}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    height: 0,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderRadius: '8px'
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none'
  },
  error: {
    padding: '40px',
    textAlign: 'center',
    color: '#e94560'
  }
};

export default VideoPlayer;
