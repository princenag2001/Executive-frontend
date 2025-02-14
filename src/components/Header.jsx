import React from "react";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="chat-header">
      <h1 className="chat-logo">ChatApp</h1>
      <nav className="nav-links">
        <button className="nav-button" onClick={() => navigate("/settings")}>Settings</button>
        <button className="nav-button" onClick={() => navigate("/dashboard")}>Profile</button>
        <button className="nav-button logout" onClick={() => navigate("/login")}>Logout</button>
      </nav>
    </header>
  );
};

export default ChatHeader;
