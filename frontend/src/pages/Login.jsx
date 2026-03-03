import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to continue learning</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '1.8rem',
    color: '#1a1a2e',
    textAlign: 'center'
  },
  subtitle: {
    margin: '0 0 24px 0',
    color: '#666',
    textAlign: 'center'
  },
  error: {
    backgroundColor: '#fee',
    color: '#e94560',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '0.9rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    outline: 'none'
  },
  button: {
    backgroundColor: '#e94560',
    color: '#fff',
    padding: '14px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px'
  },
  footer: {
    textAlign: 'center',
    margin: '20px 0 0 0',
    color: '#666'
  },
  link: {
    color: '#e94560',
    textDecoration: 'none',
    fontWeight: '500'
  }
};

export default Login;
