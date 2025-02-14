import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiClass from "../api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || !fullName) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await ApiClass.postNodeRequest("/api/auth/register", true, {
        email,
        password,
        fullName,
      });

      if (response.status === 201) {
        navigate("/login");
      } else {
        setError("Registration failed");
      }
    } catch (error) {
      setError("Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="logo">🔷</div>
        <h2>Create Account</h2>
        <p className="subtitle">Get started with your free account</p>

        {error && <p className="message error">{error}</p>}

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
