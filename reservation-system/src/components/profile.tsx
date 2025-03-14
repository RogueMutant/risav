import React, { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import "../styles/index.css";
import { useAuth } from "./authContext";
import { BsCamera, BsPersonFill } from "react-icons/bs";
import Back from "./back";

interface ProfileData {
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  password: string;
}

export const Profile = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phoneNumber: "",
    profileImage: "",
    password: "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profilePictureURL, setProfilePictureURL] = useState<
    string | undefined
  >("");
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const { updateUser, user, error: updateError } = useAuth();
  const [currentImage, setCurrentImage] = useState<string | undefined>(
    undefined
  );

  const userImg = user?.profileImageUrl as string;
  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setProfilePictureURL(URL.createObjectURL(file));
      console.log("users image: ", profilePictureURL);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    console.log(userImg, profilePictureURL);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log(user?._id);
    try {
      await updateUser(
        profile.email,
        profile.name,
        profile.phoneNumber || "",
        passwordData.newPassword,
        profilePicture || undefined
      );
      if (!updateError) {
        setSuccessMessage("Profile updated successfully!");
      }
    } catch (err) {
      setError("Failed to update profile.");
      console.error("Profile update error:", err);
    } finally {
      setLoading(false);
      setIsEditing(false);
      setSuccessMessage("");
    }
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (profilePictureURL) {
      setCurrentImage(profilePictureURL);
    } else if (user?.profileImageUrl) {
      setCurrentImage(user.profileImageUrl as string);
    } else {
      setCurrentImage("/default-profile.png");
    }
  }, [profilePictureURL, user]);

  return (
    <div className="profile-container">
      <h1>Manage Profile</h1>
      <Back position="absolute" />
      <div className="profile-card">
        <div className="profile-picture">
          <label htmlFor="profilePictureInput">
            <div className="profile-picture-circle">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt="User Profile"
                  className="profile-image"
                />
              ) : (
                <BsPersonFill className="user-icon" />
              )}

              <BsCamera className="camera-icon" />
            </div>
          </label>
          <input
            type="file"
            id="profilePictureInput"
            accept="image/*"
            onChange={handleProfilePictureChange}
            style={{ display: "none" }}
          />
        </div>
        <h2>Profile Information</h2>
        {!isEditing ? (
          <div>
            <p>
              <strong>Name:</strong> {profile?.name || user?.name}
            </p>
            <p>
              <strong>Email:</strong> {profile?.email || user?.email}
            </p>
            <p>
              <strong>Phone No:</strong>{" "}
              {profile?.phoneNumber || user?.phoneNumber}
            </p>
            <button onClick={handleEditClick}>Edit Profile</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="edit-form">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />

            <label htmlFor="phoneNumber">Phone No</label>
            <input
              type="tel"
              name="phoneNumber"
              value={profile.phoneNumber || ""}
              onChange={handleChange}
              placeholder="+234 801 234 5678"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </form>
        )}

        <h2>Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="input-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmNewPassword: e.target.value,
                })
              }
              required
            />
          </div>
          {passwordError && (
            <div className="error-message" style={{ color: "red" }}>
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="success-message">{passwordSuccess}</div>
          )}
          <button type="submit" className="change-password-button">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};
