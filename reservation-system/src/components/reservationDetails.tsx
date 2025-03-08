import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Resource } from "../types/custom";
import "../styles/user/reservationDetails.css";
import { useFetch } from "../hooks/useFetch";

interface ReservationModalProps {
  resource: Resource;
  onClose: () => void;
}
const url = "/api/reservations/v1";
export const ReservationModal: React.FC<ReservationModalProps> = ({
  resource,
  onClose,
}) => {
  const [isReservationMade, setIsReservationMade] = useState(false); // New state for reservation confirmation
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [fromTime, setFromTime] = useState<string>("");
  const [toTime, setToTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const {
    loading,
    fetchData,
    error: reservationError,
  } = useFetch(url, false, "post");

  // Filter out unavailable days
  const isDayAvailable = (date: Date) => {
    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    return resource.availableDays.includes(day);
  };

  // Get available times based on the selected date
  const getAvailableTimes = () => {
    if (!selectedDate) return [];
    return resource.availableTime;
  };

  // Handle date selection
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setFromTime("");
    setToTime("");
  };

  const handleFromTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromTime(e.target.value);
    setToTime("");
  };

  const handleToTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToTime(e.target.value);
  };
  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  };

  const getValidToTimes = () => {
    if (!fromTime) return [];
    const availableTimes = getAvailableTimes();
    const fromIndex = availableTimes.indexOf(fromTime);
    return availableTimes.slice(fromIndex + 1); // Only allow times after "from" time
  };

  // Handle reservation submission
  const handleMakeReservation = async () => {
    try {
      const result = await fetchData(
        {
          resourceId: resource._id,
          reservationDate: selectedDate,
          time: [fromTime, toTime],
          reason: reason,
          resource: resource.name,
        },
        "post"
      );
      if (result) {
        setIsReservationMade(true);
        console.log("Reservation made successfully", result);
      }
    } catch (error) {
      console.error("Error making reservation", reservationError);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Reservation Details</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="reservation-details">
          <div className="reservation-info">
            <h3>{resource.name}</h3>
            <p>Resource Id: {resource._id}</p>
          </div>

          <div className="details-section">
            <h4>Reservation Information</h4>
            <div className="detail-item">
              <span>Date:</span>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                filterDate={isDayAvailable}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select a date"
                className="date-picker"
              />
            </div>
            <div className="detail-item">
              <span>From:</span>
              <select
                value={fromTime}
                onChange={handleFromTimeChange}
                disabled={!selectedDate}
                className="time-picker"
              >
                <option value="">Select a start time</option>
                {getAvailableTimes().map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="detail-item">
              <span>To:</span>
              <select
                value={toTime}
                onChange={handleToTimeChange}
                disabled={!fromTime}
                className="time-picker"
              >
                <option value="">Select an end time</option>
                {getValidToTimes().map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="detail-item">
              <span>Reason:</span>
              <textarea
                placeholder="Reason for reservation (optional)"
                rows={3}
                value={reason}
                onChange={handleReasonChange}
                maxLength={200}
              />
            </div>
            <div className="detail-item">
              <span>Location:</span>
              <span>{resource.location}</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button
            className={
              selectedDate && fromTime && toTime
                ? "make-reservation"
                : "deny-reservation"
            }
            onClick={() => handleMakeReservation()}
            disabled={!selectedDate || !fromTime || !toTime}
          >
            Make Reservation
          </button>
          <button className="cancel" onClick={() => setIsCancelOpen(true)}>
            Cancel
          </button>
          <button className="back" onClick={onClose}>
            Back
          </button>
        </div>

        {/* Reservation Confirmation Modal */}
        {isReservationMade && (
          <div className="confirmation-modal">
            <div className="confirmation-content">
              <h3>Reservation Submitted Successful!</h3>
              <p>
                Your reservation for <strong>{resource.name}</strong> on{" "}
                <strong>{selectedDate?.toLocaleDateString()}</strong> from{" "}
                <strong>{fromTime}</strong> to <strong>{toTime}</strong> has
                been successfully submitted. Please wait for confirmation.
              </p>
              <button
                className="confirm-button"
                onClick={() => {
                  setIsReservationMade(false);
                  onClose();
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {isCancelOpen && (
          <div className="cancel-reservation">
            <h3>Cancel Reservation</h3>
            <div className="warning">
              <h4>Warning</h4>
              <p>
                You are about to cancel your reservation. This action cannot be
                undone.
              </p>
            </div>
            <div className="reason-input">
              <textarea placeholder="Reason for cancellation (optional)" />
            </div>
            <button className="confirm-cancellation">
              Confirm Cancellation
            </button>
            <button className="go-back" onClick={() => setIsCancelOpen(false)}>
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
