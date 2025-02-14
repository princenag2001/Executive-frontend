import React, { useState, useEffect, useRef, use } from "react";
import { FaUserCircle } from "react-icons/fa";
import ChatHeader from "../components/Header";
import ApiClass from "../api";
import { useSocket } from "../context/SocketContext";
import persistedStore from "../persistedStore";

const ChatDashboard = () => {

  const messageEndRef = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { onlineUsers, messages: socketMessages, sendMessage, inputChange, typingUsers, createGroup, groups: socketContacts, setMessages: setSocketMessages } = useSocket(); // ✅ Correct import usage
  console.log("Online users34:", onlineUsers, typingUsers);

  // ✅ Fetch users list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await ApiClass.getNodeRequest("/api/messages/getUser");
        if (response.data) {
          console.log("Contacts:", response.data);
          setContacts(response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredContacts = contacts.filter((user) =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  //Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await ApiClass.getNodeRequest("/api/messages/getGroups");
        if (response.data) {
          console.log("Groups45:", response.data);
          //set contacts
          setContacts((prev) => [...prev, ...response.data]);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);


  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);



  // ✅ Fetch messages for the selected user
  const handleUserClick = async (user) => {
    setSelectedUser(user);

    try {
      const response = await ApiClass.getNodeRequest(`/api/messages/getMessages/${user._id}/${user.type}/${user?.members}`);
      if (response.data) {
        console.log("Messages:", response.data);
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  //Hnalde input Change
  const handleInputChange = (e) => {
    setMessageText(e.target.value);

    // Notify socket that user is typing
    if (e.target.value.length == 0) {
      console.log("1qw23eds")
      inputChange(persistedStore.user()._id, selectedUser._id, false);
    }
    else inputChange(persistedStore.user()._id, selectedUser._id, true);
  };


  // ✅ Open Group Modal
  const openGroupModal = () => {
    setShowGroupModal(true);
    setGroupName("");
    setSelectedParticipants([]);
  };

  // ✅ Close Group Modal
  const closeGroupModal = () => {
    setShowGroupModal(false);
  };

  // ✅ Handle participant selection
  const handleParticipantToggle = (userId) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // ✅ Create group chat
  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedParticipants.length < 2) {
      alert("Please enter a valid group name and select at least 2 participants.");
      return;
    }
    try {
      console.log("Selected participants:", { groupName, members: selectedParticipants });
      await createGroup({ groupName, members: selectedParticipants });
      closeGroupModal();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  // ✅ Function to send messages
  const handleSendMessage = async () => {
    if (!messageText.trim()) return; // Prevent sending empty messages
    if (!selectedUser) return; // Ensure a user is selected

    try {
      const currentUserId = persistedStore.user()._id; // Get the current user's ID

      const newMessage = {
        senderId: currentUserId, // Sender's ID
        receiverId: Array.isArray(selectedUser?.members)
          ? selectedUser.members.filter(id => id !== currentUserId) // Remove current user
          : selectedUser._id !== currentUserId ? [selectedUser._id] : [], // Ensure an array and exclude self
        text: messageText,
        type: selectedUser?.type === "group" ? "group" : "private",
        groupId: selectedUser?.type === "group" ? selectedUser._id : null,
      };

      inputChange(persistedStore.user()._id, selectedUser._id, false);
      // ✅ Send message via API
      const response = await ApiClass.postNodeRequest(
        `/api/messages/sendMessage/${selectedUser._id}`,
        true,
        newMessage
      );

      if (response.data) {
        setMessageText(""); // ✅ Clear input field
      }

      // ✅ Send message via WebSocket (handle group or single user)
      sendMessage(newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };


  // ✅ Automatically update messages when a new message arrives via socket
  useEffect(() => {
    if (socketMessages.length > 0 && selectedUser) {
      console.log("Socket messages:", socketMessages, persistedStore.user()._id, selectedUser._id || selectedUser.groupId);

      let filteredMessages = [];

      socketMessages.forEach(msg => {
        if (msg.type === "group") {
          // Group Chat: Ensure the message belongs to the correct group
          if (msg.groupId === selectedUser._id) {
            filteredMessages.push(msg);
          }
        } else {
          // Private Chat: Ensure the message is either sent or received by the current user
          if (msg.sender === persistedStore.user()._id || msg.receiver === persistedStore.user()._id) {
            filteredMessages.push(msg);
          }
        }
      });

      console.log("Filtered messages:", filteredMessages, messages);

      if (filteredMessages.length > 0) {
        setMessages((prev) => [...prev, ...filteredMessages]);
      }

      setSocketMessages([]); // Clear socket messages after updating
    }
  }, [socketMessages, selectedUser]);



  useEffect(() => {
    if (socketContacts.length > 0) {
      setContacts((prev) => [...prev, ...socketContacts]);
    }
  }, [socketContacts]);


  return (
    <>
      {/* Header Component */}
      <ChatHeader />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100vw",
          height: "100vh",
          backgroundColor: "#222",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)"
        }}
      >
        {/* Sidebar */}
        <aside className="sidebar">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
            <h2 className="sidebar-title">Chats</h2>
            <button className="group-create" onClick={openGroupModal}>Create Group</button>
          </div>

          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "91%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />

          <ul className="user-list">
            {filteredContacts.map((user) => (
              <li
                key={user._id}
                className={`user ${selectedUser?._id === user._id ? "active" : ""}`}
                onClick={() => handleUserClick(user)}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span
                  className="status-dot"
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: onlineUsers.includes(user._id) ? "green" : "orange",
                  }}
                ></span>
                {user.profilePic ? (
                  <img src={user.profilePic} alt="User" className="user-icon" />
                ) : (
                  <FaUserCircle className="user-icon" />
                )}
                <span>{user?.fullName ? user.fullName : user?.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat Window */}
        {/* Chat Window */}
        <main className="chat-main">
          {selectedUser ? (
            <div className="chat-box">
              <h2 className="chat-title">{selectedUser?.fullName ? selectedUser.fullName : selectedUser?.name}</h2>

              <div className="chat-messages">
                {messages.reduce((acc, msg, index) => {
                  const sender = contacts.find((user) => user._id === msg.sender);
                  const formattedTime = msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "";

                  const messageDate = msg.timestamp
                    ? new Date(msg.timestamp).toLocaleDateString()
                    : msg.createdAt
                      ? new Date(msg.createdAt).toLocaleDateString()
                      : "";

                  // Check if the previous message has a different date
                  const previousMessage = messages[index - 1];
                  const previousDate =
                    previousMessage?.timestamp
                      ? new Date(previousMessage.timestamp).toLocaleDateString()
                      : previousMessage?.createdAt
                        ? new Date(previousMessage.createdAt).toLocaleDateString()
                        : "";

                  // Add a date separator when a new date appears
                  if (messageDate !== previousDate) {
                    acc.push(
                      <div key={`date-${messageDate}`} className="date-separator">
                        <span className="date-text">{messageDate}</span>
                      </div>
                    );
                  }

                  acc.push(
                    <div key={msg._id} className={`message ${msg.sender === persistedStore.user()._id ? "me" : "them"}`}>
                      <span className="username">{sender?.fullName}</span>
                      <p className="message-text">{msg.text}</p>
                      <span className="message-time">{formattedTime}</span>
                    </div>
                  );

                  return acc;
                }, [])}

                {/* Invisible div to scroll to */}
                <div ref={messageEndRef} />
              </div>


              {/* ✅ Typing indicator */}
              {(typingUsers.status) && (
                <div className="typing-indicator">
                  {selectedUser.fullName} is typing...
                </div>
              )}

              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    handleInputChange(e);
                  }}
                />
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  // onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <button onClick={() => document.getElementById("fileInput").click()}>
                  📎
                </button>
                <button onClick={handleSendMessage}>Send</button>
              </div>

            </div>
          ) : (
            <div className="chat-welcome">
              <div className="chat-icon">📩</div>
              <h2>Welcome to ChatsApp!</h2>
              <p>Select a conversation from the sidebar to start chatting.</p>
            </div>
          )}
        </main>

      </div>
      {/* Group Chat Modal */}
      {showGroupModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create Group Chat</h2>
            <input type="text" placeholder="Enter group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
            <h3>Select Participants</h3>
            <ul className="participants-list">
              {contacts.filter((contact) => contact?.type !== "group").map((user) => (
                <li key={user._id} className="participant">
                  <input type="checkbox" checked={selectedParticipants.includes(user._id)} onChange={() => handleParticipantToggle(user._id)} />
                  {user.fullName}
                </li>
              ))}
            </ul>
            <div className="modal-actions">
              <button className="group-create" onClick={handleCreateGroup}>Create</button>
              <button className="group-create" onClick={closeGroupModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatDashboard;
