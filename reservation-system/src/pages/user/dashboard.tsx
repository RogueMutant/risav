import React, { useState, useEffect, Suspense, lazy } from "react";
import { Navbar } from "../../components/userNav";
import "../../styles/user/userDashboard.css";
import { useAuth } from "../../components/authContext";
import { Category, Resource } from "../../types/custom";
import { useNavigate } from "react-router-dom";
import { ReservationModal } from "../../components/reservationDetails";

const CategoryList = lazy(() => import("../../components/categoryListProp"));
const ResourceList = lazy(() => import("../../components/resourceListProp"));

export const UserDashboard = () => {
  const { user, userCategories, userResources } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [isAsideNavOpen, setIsAsideNavOpen] = useState(true);
  const [statusDisplay, setStatusDisplay] = useState<{
    upcoming: boolean;
    past: boolean;
    cancelled: boolean;
  }>({ upcoming: true, past: false, cancelled: false });
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleAsideNav = () => {
    setIsAsideNavOpen(!isAsideNavOpen);
  };

  const toggleStatusDisplay = (status: string) => {
    setStatusDisplay({
      upcoming: status === "upcoming",
      past: status === "past",
      cancelled: status === "cancelled",
    });
  };

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResource(null);
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
            <button onClick={() => navigate("#new")}>New Reservation</button>
            <div className="status-buttons-wrapper">
              {" "}
              {/* Changed class name */}
              <button
                className={statusDisplay.upcoming ? "active" : ""}
                onClick={() => toggleStatusDisplay("upcoming")}
              >
                Upcoming
              </button>
              <button
                className={statusDisplay.past ? "active" : ""}
                onClick={() => toggleStatusDisplay("past")}
              >
                Past
              </button>
              <button
                className={statusDisplay.cancelled ? "active" : ""}
                onClick={() => toggleStatusDisplay("cancelled")}
              >
                Canceled
              </button>
            </div>
          </div>
          <article className="reservation-status-wrapper">
            {(statusDisplay.upcoming || window.innerWidth >= 768) && (
              <div className="reservation-status">
                <p>Upcoming</p>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
            {(statusDisplay.past || window.innerWidth >= 768) && (
              <div className="reservation-status">
                <p>Past</p>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
            {(statusDisplay.cancelled || window.innerWidth >= 768) && (
              <div className="reservation-status">
                <p>Canceled</p>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
          </article>
        </section>
        <section className="reservations-section" id="new">
          <h2>New Reservation</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
            />
            <ResourceList
              resources={filteredResources}
              onResourceClick={handleResourceClick}
            />
          </Suspense>
        </section>
      </div>
      {isModalOpen && selectedResource && (
        <ReservationModal resource={selectedResource} onClose={closeModal} />
      )}
    </>
  );
};
