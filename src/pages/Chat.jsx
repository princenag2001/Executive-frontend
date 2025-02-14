import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Connect to the backend server and send token in the handshake
const socket = io("http://localhost:3009", {
  auth: {
    token: localStorage.getItem("token"), // Sending token in the 'auth' object
  },
});

const ChatApp = () => {
  const [userId, setUserId] = useState(""); // Logged-in user's ID
  const [receiverId, setReceiverId] = useState(""); // Selected receiver's ID (for private messages)
  const [groupId, setGroupId] = useState(""); // Group ID (for group messages)
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Messages exchanged with the receiver/group
  const [users, setUsers] = useState([]); // List of all users

  // Get logged-in user and fetch user list from backend
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      socket.emit("register", storedUserId); // Register user on socket server
    }

    // Fetch list of users to show for selection
    socket.emit("getUsers");
    socket.on("userList", (userList) => {
      setUsers(userList);
    });

    // Listen for incoming messages
    socket.on("message", (msg) => {
      // Update messages based on receiverId or groupId
      if (
        (msg.receiver === receiverId || msg.sender === receiverId) ||
        msg.groupId === groupId
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("message");
      socket.off("userList");
    };
  }, [receiverId, groupId]);

  // Send a message to the receiver (private)
  const sendPrivateMessage = () => {
    if (message.trim() && receiverId.trim()) {
      socket.emit("privateMessage", { sender: userId, receiver: receiverId, message });
      setMessages((prev) => [...prev, { sender: userId, text: message, receiver: receiverId, type: "private" }]);
      setMessage("");
    }
  };

  // Send a message to the group
  const sendGroupMessage = () => {
    if (message.trim() && groupId.trim()) {
      socket.emit("groupMessage", { groupId, sender: userId, message });
      setMessages((prev) => [...prev, { sender: userId, text: message, groupId, type: "group" }]);
      setMessage("");
    }
  };

  // Join a group
  const joinGroup = () => {
    if (groupId.trim()) {
      socket.emit("joinGroup", groupId); // Join the specified group
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat App</h2>

      {/* User List for selecting who to chat with */}
      <div className="user-list">
        <h3>Select a User to Chat</h3>
        <ul>
          {users.map((user) => (
            <li key={user} onClick={() => {
              setReceiverId(user);
              setGroupId(""); // Clear groupId if user selects a private chat
            }}>
              {user}
            </li>
          ))}
        </ul>
      </div>

      {/* Group Chat Section */}
      <div className="group-chat">
        <h3>Enter Group ID to Join</h3>
        <input
          type="text"
          placeholder="Group ID"
          value={groupId}
          onChange={(e) => {
            setGroupId(e.target.value);
            setReceiverId(""); // Clear receiverId if user selects a group chat
          }}
        />
        <button onClick={joinGroup}>Join Group</button>
      </div>

      {/* Chat Window */}
      {(receiverId || groupId) && (
        <div>
          <h3>
            {receiverId
              ? `Chatting with: ${receiverId}`
              : `Group Chat: ${groupId}`}
          </h3>
          <div className="chat-window">
            {messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.sender}:</strong> {msg.text} ({msg.type})
              </p>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={receiverId ? sendPrivateMessage : sendGroupMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
