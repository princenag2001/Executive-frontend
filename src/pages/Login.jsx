import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../lib/socket"; // Import global socket instance
import ApiClass from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill out both fields");
      return;
    }

    try {
      const response = await ApiClass.postNodeRequest(
        "/api/auth/login",
        true,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.userData) {
        // Save user & token
        localStorage.setItem("user", JSON.stringify(response.data.userData));
        localStorage.setItem("token", response.data.token);

        // 🔌 Connect to Socket.IO after login
        socket.auth = { userId: response.data.userData._id }; // Send user ID for authentication
        socket.connect();

        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 1000,
          onClose: () => navigate("/chatDashboard"),
        });
      }
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p>Sign in to your account.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Sign In</button>
        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} className="register-link">
            Create account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
