import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]); // ✅ Store messages
  const [groups, setContacts] = useState([]);

  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user._id : null; // Extract userId

    if (!userId) return; // Don't connect socket if userId is missing

    const newSocket = io("http://localhost:5001", {
      query: { userId }, // ✅ Pass userId in query params
    });

    setSocket(newSocket);

    // 🔹 Listen for online users
    newSocket.on("onlineUsers", (users) => {
      console.log("👥 Online users:", users);
      setOnlineUsers(users);
    });

    // 🔹 Listen for new messages
    newSocket.on("newMessage", (message) => {
      console.log("📩 New Message:", message);
      setMessages((prev) => [...prev, message]); // Append new message
    });

    newSocket.on("typing", (data) => {
        console.log("Typing:", data);
        setTypingUsers(data);

    })

    newSocket.on("groupCreated", (data) => {
      console.log("Group created:", data);
      setContacts((prev) => [...prev, data]);

    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // ✅ Function to send messages via socket
  const sendMessage = (messageData) => {
    if (socket) {
      socket.emit("sendMessage", messageData); // Send message event
    }
  };

  const inputChange = (senderId, receiverId, status) => {
    socket.emit("inputChange", { senderId, receiverId, status });
  };

  const createGroup = (groupData) => {
    console.log("Group data:", groupData);
    if (socket) {
      socket.emit("createGroup", groupData);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, messages, sendMessage, inputChange, typingUsers, createGroup, groups, setMessages }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
