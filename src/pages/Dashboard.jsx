import React, { useState, useEffect } from "react";
import persistedStore from "../persistedStore";
import { FaUserCircle } from "react-icons/fa";
import ApiClass from "../api";
import ChatHeader from "../components/Header";

const Dashboard = () => {
    const [user, setUser] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch user details from persisted store
    useEffect(() => {
        console.log("User Data:", persistedStore.user());
        setUser(persistedStore.user());
    }, []);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            alert("No file selected.");
            return;
        }

        // Validate file type (Only images allowed)
        const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validImageTypes.includes(file.type)) {
            alert("Please select a valid image file (JPG, PNG, GIF, or WEBP).");
            return;
        }

        // Validate file size (Max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB.");
            return;
        }

        setSelectedFile(file);
    };

    // Handle profile picture upload
    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select an image to upload.");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
            try {
                const response = await ApiClass.putNodeRequest("/api/auth/update", true, {
                    profilePic: reader.result, // Sending base64 image string
                });

                if (response.data.updatedUser) {
                    setUser(response.data.updatedUser);
                    alert("Profile picture updated successfully!");
                } else {
                    alert("Failed to update profile picture.");
                }
            } catch (error) {
                console.error("Error uploading profile picture:", error);
                alert("Error uploading profile picture");
            }
        };
    };


    return (
        <>
            <ChatHeader />
            <div className="dashboard-container">

                <div className="profile-card">
                    <div className="profile-avatar">
                        {user.profilePic ? (
                            <img src={user.profilePic} alt="Profile" className="profile-img" />
                        ) : (
                            <FaUserCircle size={80} />
                        )}
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <button onClick={handleUpload}>Upload</button>
                    </div>

                    <div className="profile-info">
                        <label>Full Name</label>
                        <input type="text" value={user.fullName || ""} readOnly />

                        <label>Email Address</label>
                        <input type="email" value={user.email || ""} readOnly />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
