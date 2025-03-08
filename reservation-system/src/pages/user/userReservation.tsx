import React from "react";
import "../../styles/user/reservationsScreen.css";
import { Navbar } from "../../components/userNav";
import { Reservation } from "../../types/custom";

export const ReservationsScreen: React.FC = () => {
  const reservations: Reservation[] = [
    {
      _id: "1",
      startDate: "2023-10-15",
      endDate: "18:00",
      reason: "Main Restaurant",
      status: "confirmed",
      time: ["12:00"],
    },
    {
      _id: "2",
      startDate: "2023-10-16",
      endDate: "19:30",
      reason: "Rooftop Bar",
      status: "pending",
      time: ["18:00"],
    },
    {
      _id: "3",
      startDate: "2023-10-17",
      endDate: "20:00",
      reason: "Private Dining",
      status: "cancelled",
      time: ["19:00"],
    },
  ];

  return (
    <>
      <Navbar />
      {/* <div className="reservations-screen">
        <h1>My Reservations</h1>
        <div className="reservations-list">
          {reservations.map((reservation) => (
            <div
              key={reservation._id}
              className={`reservation-card ${reservation.status.toLowerCase()}`}
            >
              <div className="reservation-info">
                <h2>{reservation.reason}</h2>
                <p>
                  <strong>Date:</strong> {reservation.startDate}
                </p>
                <p>
                  <strong>Time:</strong> {reservation.endDate}
                </p>
              </div>
              <div className="reservation-status">
                <span>{reservation.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
};
