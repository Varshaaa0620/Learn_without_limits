import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          LMS
        </Link>
        
        <div style={styles.navLinks}>
          {isAuthenticated ? (
            <>
              <span style={styles.welcome}>Welcome, {user?.full_name}</span>
              <button onClick={handleLogout} style={styles.button}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/signup" style={styles.button}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#1a1a2e',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 16px'
  },
  button: {
    backgroundColor: '#e94560',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: '4px',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  welcome: {
    color: '#fff'
  }
};

export default Navbar;
