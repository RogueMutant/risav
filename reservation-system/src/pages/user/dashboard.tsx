import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/userNav";
import "../../styles/user/userDashboard.css";
import { useAuth } from "../../components/authContext";
import { Category, Resource } from "../../types/custom";
import { useNavigate } from "react-router-dom";

export const UserDashboard = () => {
  const { user, userCategories, userResources } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [isAsideNavOpen, setIsAsideNavOpen] = useState(true);
  const navigate = useNavigate();

  const toggleAsideNav = () => {
    setIsAsideNavOpen(!isAsideNavOpen);
  };
  useEffect(() => {
    if (userCategories) {
      setCategories(userCategories);
    }
  }, [userCategories]);

  useEffect(() => {
    if (selectedCategory && userResources) {
      const resourcesInCategory = userResources.filter((resource) => {
        const categoryId =
          typeof resource.category === "string"
            ? resource.category
            : resource.category._id;
        return categoryId === selectedCategory;
      });
      setFilteredResources(resourcesInCategory);
    } else {
      setFilteredResources([]);
    }
  }, [selectedCategory, userResources]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <>
      <Navbar />
      <button
        className="toggle-aside-nav"
        onClick={() => setIsAsideNavOpen(!isAsideNavOpen)}
      >
        {isAsideNavOpen ? "Hide Nav" : "Show Nav"}
      </button>
      {isAsideNavOpen && (
        <aside className="sidebar">
          <ul>
            <li>Dashboard</li>
            <li>Reservations</li>
            <li>Resources</li>
            <li>Profile</li>
            <li>Settings</li>
          </ul>
        </aside>
      )}
      <div className="dashboard-content">
        <section className="welcome-section">
          <div>
            <h1>Welcome back, {user?.name || "User"}!</h1>
            <p>You have 2 upcoming reservations.</p>
          </div>
          <div className="btn-container">
            <button>New Reservation</button>
            <div className="wrapper">
              <button>Upcoming</button>
              <button>Past</button>
              <button>Canceled</button>
            </div>
          </div>
          <div className="details"></div>
        </section>
        <section className="reservations-section">
          <h2>New Reservation</h2>
          <div className="category-list">
            {categories.map((category) => (
              <div
                className={`category-card ${
                  selectedCategory === category._id ? "active" : ""
                }`}
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
              >
                {category.name}
              </div>
            ))}
          </div>
          <div className="resource-list">
            {filteredResources.map((resource) => (
              <div className="resource-card" key={resource._id}>
                <img
                  src={resource.imageUrl as string}
                  alt={resource.name}
                  className="resource-image"
                />
                <div className="resource-details">
                  <h3>{resource.name}</h3>
                  <p>{resource.description}</p>
                  <button
                    className="details-button"
                    onClick={() => navigate(`/reservation/${resource._id}`)}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
