import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!email || !password) {
      setError('Please fill out both fields');
      return;
    }

    try {
      // Make API request to the backend
      const response = await axios.post('http://localhost:3009/api/auth/login', { email, password });

      if (response.data.token) {
        alert('Login successful!');
        // Optionally store the JWT token in localStorage or sessionStorage
        localStorage.setItem('token', response.data.token);
        // Redirect user to another page after login
        window.location.href = '/dashboard'; // Example redirect
      }
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Login Page</h1>
      <p>This is the Login page where users can sign in.</p>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <button type="submit" style={styles.button}>
          Log In
        </button>
      </form>

      <p style={styles.forgotPassword}>
        <a href="#">Forgot your password?</a>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
  },
  forgotPassword: {
    textAlign: 'center',
    marginTop: '10px',
  },
};

export default Login;
