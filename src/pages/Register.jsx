import React, { useState } from 'react';
import ApiClass from '../api';

const RegisterPage = () => {
  // State variables remain the same
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Simple validation remains the same
    if (!email || !password || !firstName || !lastName) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const response = await ApiClass.postNodeRequest('/api/auth/register', true, { email, password, firstName, lastName });

      if (response.status === 200) {
        setSuccess('User registered successfully!');
      }
    } catch (error) {
      setError('Error registering user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1 className="title">Sign Up</h1>
      
      {error && <p className="message error">{error}</p>}
      {success && <p className="message success">{success}</p>}
      
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
          className="input"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
          className="input"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="input"
        />
        
        <div className="checkbox-container">
          <input type="checkbox" id="rememberMe" className="checkbox" />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>
        
        <button type="submit" disabled={loading} className="button">
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>
      
      <a href="/terms" className="terms-link">Terms & Conditions</a>
    </div>
  );
};

export default RegisterPage;
