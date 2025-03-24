import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsSearch,
  BsBell,
  BsPersonCircle,
  BsList,
  BsGearFill,
  BsHouse,
  BsPerson,
  BsPersonFill,
  BsHouseFill,
  BsCalendarFill,
} from "react-icons/bs";
import "../styles/user/Navbar.css";
import { useAuth } from "./authContext";

export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logOut = () => {
    logout();
    navigate("/login");
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
            placeholder="Search categories, resources etc."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <BsSearch />
          </button>
        </form>
        <div className="navbar-right">
          <button
            className="navbar-icon"
            onClick={() => navigate("/notification")}
          >
            <BsBell />
          </button>
          <div className="navbar-profile" onClick={toggleProfileDropdown}>
            <BsPersonCircle />
            {isProfileOpen && (
              <div className="profile-dropdown">
                <ul>
                  <li onClick={() => navigate("/profile")}>Profile</li>
                  <li onClick={() => navigate("/settings")}>Settings</li>
                  <li onClick={() => logOut()}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/user-dashboard")}>
            {" "}
            <BsHouseFill /> Dashboard
          </li>
          <li onClick={() => navigate("/user-reservations")}>
            <BsCalendarFill /> Reservations
          </li>
          <li onClick={() => navigate("/profile")}>
            <BsPersonFill /> Profile
          </li>
          <li onClick={() => navigate("/settings")}>
            <BsGearFill />
            Settings
          </li>
        </ul>
      </aside>
    </>
  );
};
