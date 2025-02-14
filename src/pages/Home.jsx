import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Home Page</h1>
      <p>This is the homepage of the app.</p>
      <div className="auth-links">
        <Link to="/register" className="btn">Register</Link>
        <Link to="/login" className="btn">Login</Link>
      </div>
    </div>
  );
};

export default Home;
