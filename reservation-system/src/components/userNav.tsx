import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsSearch, BsBell, BsPersonCircle, BsList } from "react-icons/bs";
import "../styles/user/Navbar.css";

export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Add your search logic here
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="navbar">
        <button className="hamburger-icon" onClick={toggleSidebar}>
          <BsList />
        </button>
        <div className="navbar-logo">Risav</div>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search resources, reservations, etc."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <BsSearch />
          </button>
        </form>
        <div className="navbar-right">
          <button className="navbar-icon">
            <BsBell />
          </button>
          <div className="navbar-profile" onClick={toggleProfileDropdown}>
            <BsPersonCircle />
            {isProfileOpen && (
              <div className="profile-dropdown">
                <ul>
                  <li>Profile</li>
                  <li>Settings</li>
                  <li>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul>
          <li>Dashboard</li>
          <li>Reservations</li>
          <li>Resources</li>
          <li>Profile</li>
          <li>Settings</li>
        </ul>
      </aside>
    </>
  );
};
