import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.email, formData.password, formData.fullName);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Start your learning journey today</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Create a password"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Sign in
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

export default Signup;
