import React from "react";
import { useParams } from "react-router-dom";
import "../../styles/user/reservationDetails.css";

export const ReservationDetails = () => {
  const { resourceId } = useParams<{ resourceId: string }>();

  return (
    <div className="reservation-details">
      <h1>Reservation Details</h1>
      <p>Resource ID: {resourceId}</p>
      <form>
        <label>
          Date:
          <input type="date" />
        </label>
        <label>
          Time:
          <input type="time" />
        </label>
        <button type="submit">Reserve</button>
      </form>
    </div>
  );
};
