import React, { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import "../styles/index.css";
import { useAuth } from "../components/authContext";
import { BsCamera, BsPersonFill } from "react-icons/bs";

const backendUrl = "http://localhost:9000/auth/users/me"; // Corrected URL

interface ProfileData {
  name: string;
  email: string;
  phoneNumber?: string; // Changed to string for phone number
  profilePictureURL?: string;
}

export const Profile = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phoneNumber: "",
    profilePictureURL: "",
  });
  const [passwordData, setPasswordData] = useState({
    // Corrected typo
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [shouldFetch, setShouldFetch] = useState(true); // Fetch on mount
  const [isEditing, setIsEditing] = useState(false);
  const [profilePictureURL, setProfilePictureURL] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState(""); // For profile update errors
  const [success, setSuccess] = useState(""); // For profile update success
  const [passwordError, setPasswordError] = useState(""); // For password errors
  const [passwordSuccess, setPasswordSuccess] = useState(""); // For password success

  const {
    data,
    error: fetchError,
    loading: fetchLoading,
    fetchData,
  } = useFetch<ProfileData>(backendUrl, shouldFetch, "get");

  const { user } = useAuth();

  useEffect(() => {
    if (user && !data && !fetchLoading) {
      setShouldFetch(true);
    }
  }, [user, data, fetchLoading]);

  useEffect(() => {
    if (data) {
      setProfile(data);
      if (profile.profilePictureURL) {
        setProfilePictureURL(profile.profilePictureURL);
      }
    }
    if (fetchError) {
      console.error("Error fetching profile:", fetchError);
    }
  }, [data, fetchError]);

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setProfilePictureURL(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading while updating
    setError(""); // Clear previous errors

    const formData = new FormData();
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    if (profile.phoneNumber) {
      formData.append("phoneNumber", profile.phoneNumber);
    }

    fetchData(formData, "put")
      .then(() => {
        setSuccess("Profile updated successfully!");
        setIsEditing(false); // Go out of edit mode after success
        setProfilePicture(null);
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message ||
            "Error updating profile. Please try again later."
        );
        console.error("Profile update error:", err);
      })
      .finally(() => setLoading(false));
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

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     if (user) {
  //       setLoading(true);
  //       try {
  //         const profileData = await appwrite.database.getDocument(
  //           'your_database_id', // Replace with your database ID
  //           'your_profile_collection_id', // Replace with your profile collection ID
  //           user.$id // Use the user's ID to fetch their profile
  //         );
  //         setProfile(profileData);
  //         setProfilePictureURL(profileData.profilePictureURL); // Set initial URL
  //       } catch (error) {
  //         console.error("Error fetching profile:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };
  //   fetchProfile();
  // }, [user, appwrite]);
  // const handleProfilePictureUpload = async () => {
  //   if (profilePicture) {
  //     setLoading(true); // Set loading to true
  //     try {
  //       const file = await appwrite.storage.createFile(
  //         ID.unique(),
  //         profilePicture
  //       );
  //       const url = await appwrite.storage.getFileView(file.$id);
  //       await appwrite.database.updateDocument(
  //         "your_database_id",
  //         "your_profile_collection_id",
  //         profile.$id, // Update the existing profile document
  //         }
  //           ...profile,
  //           profilePictureURL: url, // Store the URL in the profile document
  //         }
  //       );
  //       setProfilePictureURL(url); // Update the local URL
  //       setProfile({ ...profile, profilePictureURL: url }); // Update local profile
  //       console.log("Profile picture uploaded successfully:", url);
  //     } catch (error) {
  //       console.error("Error uploading profile picture:", error);
  //     } finally {
  //       setLoading(false); // Set loading to false
  //     }
  //   }
  // };

  return (
    <div className="profile-container">
      <h1>Manage Profile</h1>

      <div className="profile-card">
        <div className="profile-picture">
          <label htmlFor="profilePictureInput">
            <div className="profile-picture-circle">
              {profilePictureURL ? (
                <img src={profilePictureURL} alt="Profile" />
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
        {fetchLoading && <div>Loading...</div>}
        {!isEditing ? (
          <div>
            <p>
              <strong>Name:</strong> {profile?.name || user?.name}
            </p>
            <p>
              <strong>Email:</strong> {profile?.email || user?.email}
            </p>
            <p>
              <strong>Phone No:</strong> {profile?.phoneNumber}
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
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="number">Phone No</label>
            <input
              type="number"
              name="phoneNumber"
              value={profile.phoneNumber || ""}
              onChange={handleChange}
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
            <label htmlFor="currentPassword">Current Password:</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              required
            />
          </div>
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
            <div className="error-message">{passwordError}</div>
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
