import React, { useState, useEffect } from "react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";

import "../styles/currentReservations.css";
import "@schedule-x/theme-default/dist/index.css";
import { useAuth } from "./authContext";
import { Reservation } from "../types/custom";

// Define an interface for calendar events
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color?: string;
}

export const CurrentReservation = () => {
  const { reservations } = useAuth(); // Get reservations from context
  const [formattedEvents, setFormattedEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (!reservations || reservations.length === 0) return;

    // Convert reservations to calendar event format
    const events = reservations.map((res) => {
      // Get reservation date and time values
      const startDate = new Date(res.reservationDate);

      // Assuming res.time[0] is in format "HH:MM" (like "14:30")
      if (res.time && res.time[0]) {
        const [hours, minutes] = res.time[0].split(":").map(Number);
        startDate.setHours(hours, minutes);
      }

      // Create end date (assuming 1 hour duration if time[1] is not available)
      const endDate = new Date(startDate);
      if (res.time && res.time[1]) {
        const [hours, minutes] = res.time[1].split(":").map(Number);
        endDate.setHours(hours, minutes);
      } else {
        endDate.setHours(endDate.getHours() + 1);
      }

      return {
        id: res._id.toString(),
        title: res.name || "Reservation",
        start: startDate.toString(),
        end: endDate.toString(),
        color: res.status === "cancelled" ? "#ff6b6b" : "#4dabf7", // Different color for cancelled
      };
    });

    console.log("Formatted Events:", events);
    setFormattedEvents(events);
  }, [reservations]);

  // Initialize calendar AFTER we have events
  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: formattedEvents,
    plugins: [createEventsServicePlugin()],
  });

  return (
    <div className="calendar-container">
      <h2>Current Reservations</h2>
      {formattedEvents.length > 0 ? (
        <ScheduleXCalendar calendarApp={calendar} />
      ) : (
        <p>No reservations to display</p>
      )}
    </div>
  );
};
