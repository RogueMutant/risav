import React, { useEffect, useState } from "react";
import "../../styles/user/reservationsScreen.css";
import { Navbar } from "../../components/userNav";
import { Reservation } from "../../types/custom";
import { useAuth } from "../../components/authContext";

export const ReservationsScreen: React.FC = () => {
  const { reservations } = useAuth();
  const [reservationList, setReservationList] = useState<Reservation[]>([]);

  useEffect(() => {
    if (reservations) {
      setReservationList(reservations);
    }
  }, [reservations]);
  return (
    <>
      <Navbar />
      <div className="reservations-screen">
        <h1>My Reservations</h1>
        <div className="reservations-list">
          {reservationList.map((reservation) => (
            <div
              key={reservation._id}
              className={`reservation-card ${reservation.status.toLowerCase()}`}
            >
              <div className="reservation-info">
                <h2>{reservation.name}</h2>
                <p>
                  <strong>Date:</strong> {reservation.reservationDate}
                </p>
                <p>
                  <strong>Time:</strong> {reservation.time[0]} -
                  {reservation.time[1]}
                </p>
                <p>
                  <strong>Reason:</strong>
                  {reservation.reason}
                </p>
              </div>
              <div className="reservation-status">
                <span
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
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
