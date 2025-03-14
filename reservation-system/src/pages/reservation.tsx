import React, { useState, useEffect } from "react";
import "../styles/ReservationDashboard.css";
import {
  BsSearch,
  BsFilter,
  BsChevronExpand,
  BsCalendar,
  BsClock,
  BsPersonFill,
  BsBookmark,
  BsCheckCircle,
  BsXCircle,
  BsExclamationCircleFill,
} from "react-icons/bs";
import { useParams } from "react-router-dom";
import { CurrentReservation } from "../components/currentReservation";
import { NotFound } from "./notfound";
import Back from "../components/back";
import { Reservation } from "../types/custom";
import { useAuth } from "../components/authContext";

export const ReservationDashboard: React.FC = () => {
  const { reservationPage } = useParams<{ reservationPage: string }>();
  const { reservations: userReservations } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("reservationDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    if (userReservations) {
      setLoading(false);
    }
  }, [userReservations]);

  // Filter and sort reservations
  const filteredAndSortedReservations = userReservations
    .filter((reservation) => {
      if (statusFilter !== "all" && reservation.status !== statusFilter) {
        return false;
      }

      if (!searchQuery.trim()) {
        return true;
      }

      const query = searchQuery.toLowerCase();
      return (
        (reservation.userName &&
          reservation.userName.toLowerCase().includes(query)) ||
        (reservation.userEmail &&
          reservation.userEmail.toLowerCase().includes(query)) ||
        (reservation.name && reservation.name.toLowerCase().includes(query)) ||
        (reservation.reason && reservation.reason.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      const valueA = a[sortField as keyof Reservation];
      const valueB = b[sortField as keyof Reservation];
      if (valueA === undefined || valueB === undefined) return 0;
      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    let className = "status-badge";
    let icon = null;

    switch (status) {
      case "confirmed":
        className += " confirmed";
        icon = <BsCheckCircle className="icon" />;
        break;
      case "pending":
        className += " pending";
        icon = <BsExclamationCircleFill className="icon" />;
        break;
      case "cancelled":
        className += " cancelled";
        icon = <BsXCircle className="icon" />;
        break;
      default:
        className += " default";
    }

    return (
      <span className={className}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      {reservationPage === "all-reservations" && (
        <div className="reservation-dashboard">
          {/* Header */}
          <Back position="relative" />
          <div className="header">
            <h3>Reservation Management</h3>
            <p>View and manage all user reservations</p>
          </div>

          {/* Filters and Search */}
          <div className="filters">
            <div className="search-box">
              <BsSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search reservations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-controls">
              <button onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <BsFilter className="filter-icon" />
                Filters
                {isFilterOpen ? <BsChevronExpand /> : <BsChevronExpand />}
              </button>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Reservation Table */}
          <table className="reservation-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("userName")}>
                  <BsPersonFill className="icon" />
                  User
                  {sortField === "userName" &&
                    (sortDirection === "asc" ? (
                      <BsChevronExpand />
                    ) : (
                      <BsChevronExpand />
                    ))}
                </th>
                <th onClick={() => handleSort("resourceName")}>
                  <BsBookmark className="icon" />
                  Resource
                  {sortField === "resourceName" &&
                    (sortDirection === "asc" ? (
                      <BsChevronExpand className="icon" />
                    ) : (
                      <BsChevronExpand />
                    ))}
                </th>
                <th onClick={() => handleSort("reservationDate")}>
                  <BsCalendar className="icon" />
                  Date
                  {sortField === "reservationDate" &&
                    (sortDirection === "asc" ? (
                      <BsChevronExpand className="icon" />
                    ) : (
                      <BsChevronExpand className="icon" />
                    ))}
                </th>
                <th>
                  <BsClock className="icon" />
                  Time
                </th>
                <th onClick={() => handleSort("status")}>
                  Status
                  {sortField === "status" &&
                    (sortDirection === "asc" ? (
                      <BsChevronExpand className="icon" />
                    ) : (
                      <BsChevronExpand />
                    ))}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedReservations.length === 0 ? (
                <tr>
                  <td colSpan={6}>No reservations found</td>
                </tr>
              ) : (
                filteredAndSortedReservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td>
                      <div className="user-info">
                        <div className="name">{reservation.userName}</div>
                        <div className="email">{reservation.userEmail}</div>
                      </div>
                    </td>
                    <td>
                      <div className="resource-info">
                        <div className="name">{reservation.name}</div>
                        <div className="reason">{reservation.reason}</div>
                      </div>
                    </td>
                    <td>{formatDate(reservation.reservationDate)}</td>
                    <td>{reservation.time}</td>
                    <td>
                      <StatusBadge status={reservation.status} />
                    </td>
                    <td>
                      <div className="actions">
                        {reservation.status === "pending" && (
                          <>
                            <button className="confirm">Confirm</button>
                            <button className="cancel">Cancel</button>
                          </>
                        )}
                        {reservation.status === "confirmed" && (
                          <button className="cancel">Cancel</button>
                        )}
                        <button className="view">View</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {reservationPage === "Current-Reservation" && <CurrentReservation />}
      {reservationPage !== "all-reservations" &&
        reservationPage !== "Current-Reservation" && <NotFound />}
    </>
  );
};
