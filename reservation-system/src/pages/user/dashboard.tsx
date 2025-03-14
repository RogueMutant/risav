import React, { useState, useEffect, Suspense, lazy } from "react";
import { Navbar } from "../../components/userNav";
import "../../styles/user/userDashboard.css";
import { useAuth } from "../../components/authContext";
import { Category, Reservation, Resource } from "../../types/custom";
import { useNavigate } from "react-router-dom";
import { ReservationModal } from "../../components/reservationDetails";
import { FaSpinner } from "react-icons/fa";

const CategoryList = lazy(() => import("../../components/categoryListProp"));
const ResourceList = lazy(() => import("../../components/resourceListProp"));

export const UserDashboard = () => {
  const { user, userCategories, userResources, reservations } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [reservationList, setReservationList] = useState<Reservation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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
    if (reservations) {
      setReservationList(reservations);
    }
  }, [userCategories, reservations]);

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

  const groupedReservations = {
    upcoming: reservationList.filter(
      (reservation) => new Date(reservation.reservationDate) > new Date()
    ),
    past: reservationList.filter(
      (reservation) => reservation.status === "confirmed"
    ),
    cancelled: reservationList.filter(
      (reservation) => reservation.status === "cancelled"
    ),
  };

  return (
    <>
      <div className="dashboard-content">
        <Navbar />
        <section className="welcome-section">
          <div>
            <h1>Welcome back, {user?.name || "User"}!</h1>
            <p>
              You have {groupedReservations.upcoming.length} upcoming
              reservations.
            </p>
          </div>
          <div className="btn-container">
            <button
              onClick={() => {
                const newSection = document.getElementById("new");
                if (newSection) {
                  newSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              New Reservation
            </button>
          </div>
        </section>

        {/* Reservation Status Sections */}
        <section className="reservation-status-sections">
          <div className="reservation-status">
            <h2>Upcoming</h2>
            {groupedReservations.past.length > 0 ? (
              groupedReservations.upcoming.map((reservation) => (
                <div key={reservation._id} className="reservation-card">
                  <p>{reservation.name}</p>
                  <p>
                    {new Date(reservation.reservationDate).toLocaleDateString()}
                    {reservation.time[0]} - {reservation.time[1]}
                  </p>
                  <p
                    className={
                      reservation.status === "pending"
                        ? "pending"
                        : reservation.status === "confirmed"
                        ? "confirmed"
                        : reservation.status === "cancelled"
                        ? "cancelled"
                        : ""
                    }
                  >
                    {reservation.status}
                  </p>
                </div>
              ))
            ) : (
              <p>Nothing here for now.</p>
            )}
          </div>

          <div className="reservation-status">
            <h2>Past</h2>
            {isLoading ? (
              <span>
                <FaSpinner />
              </span>
            ) : groupedReservations.past.length > 0 ? (
              groupedReservations.past.map((reservation) => (
                <div key={reservation._id} className="reservation-card">
                  <p>{reservation.name}</p>
                  <p>
                    {new Date(reservation.reservationDate).toLocaleDateString()}{" "}
                    {reservation.time[0]} - {reservation.time[1]}
                  </p>
                  <p
                    className={
                      reservation.status === "pending"
                        ? "pending"
                        : reservation.status === "confirmed"
                        ? "confirmed"
                        : reservation.status === "cancelled"
                        ? "cancelled"
                        : ""
                    }
                  >
                    {reservation.status}
                  </p>
                </div>
              ))
            ) : (
              <p>Nothing here for now.</p>
            )}
          </div>

          <div className="reservation-status">
            <h2>Cancelled</h2>
            {isLoading ? (
              <span>
                <FaSpinner />
              </span>
            ) : groupedReservations.cancelled.length > 0 ? (
              groupedReservations.cancelled.map((reservation) => (
                <div key={reservation._id} className="reservation-card">
                  <p>{reservation.name}</p>
                  <p>
                    {new Date(reservation.reservationDate).toLocaleDateString()}{" "}
                    {reservation.time[0]} - {reservation.time[1]}
                  </p>
                  <p
                    className={
                      reservation.status === "pending"
                        ? "pending"
                        : reservation.status === "confirmed"
                        ? "confirmed"
                        : reservation.status === "cancelled"
                        ? "cancelled"
                        : ""
                    }
                  >
                    {reservation.status}
                  </p>
                </div>
              ))
            ) : (
              <p> Nothing here for now.</p>
            )}
          </div>
        </section>

        {/* New Reservation Section */}
        <section className="reservations-section" id="new">
          <h2>New Reservation</h2>
          <Suspense
            fallback={
              <div className="loading-container" style={{ margin: "0 auto" }}>
                <FaSpinner className="loading-spinner" />
                Loading...
              </div>
            }
          >
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

      {/* Reservation Modal */}
      {isModalOpen && selectedResource && (
        <ReservationModal resource={selectedResource} onClose={closeModal} />
      )}
    </>
  );
};
