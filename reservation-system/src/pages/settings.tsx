import React, { useState, useEffect } from "react";
import { useFetch } from "../components/useFetch";
import "../styles/index.css";

const backendUrl = "http://localhost:9000/auth/register";

interface ProfileData {
  name: string;
  email: string;
  phoneNumber?: number;
}

export const Profile = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
  });
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, error, loading, fetchData } = useFetch<any>(
    backendUrl,
    shouldFetch,
    "put"
  );
  const [isEditing, setIsEditing] = useState(false); // State for edit mode

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShouldFetch(true);
  };

  const updateUser = () => {
    const updatedUser = { name: profile.name, email: profile.email };
    fetchData(updatedUser);
  };

  useEffect(() => {
    if (data) {
      console.log(data);
      setProfile({ name: "", email: "" });
      setShouldFetch(false);
      setIsEditing(false);
    }
  }, [data]);

  if (error) {
    console.error("Error fetching/updating profile:", error);
    // Display error message to the user
  }

  return (
    <div className="profile-container">
      <h1>Manage Profile</h1>
      <div className="profile-card">
        <h2>Profile Information</h2>
        {loading && <div>Loading...</div>}
        <div>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Phone No: +234 09021347781</strong> {profile.phoneNumber}
          </p>
          {/* Display other profile information */}
          {/* <button onClick={() => setIsEditing(true)}>Edit Profile</button> */}
        </div>

        <div>
          <h2>Change Password</h2>
          <form>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                required
              />
            </div>
            <button type="submit">Change Password</button>
          </form>
        </div>

        {/* <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              updateUser();
            }}
          >
            Cancel
          </button>
        </form> */}
      </div>
    </div>
  );
};
