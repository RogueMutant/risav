import React, { useState } from "react";

export const TimePickerRange: React.FC = (sta) => {
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  const handleStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
    console.log(startTime);
  };
  const handleEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
    console.log(endTime);
  };
  return (
    <div>
      <label htmlFor="startTime">From</label>
      <input
        type="time"
        name="fromTime"
        id="from-time"
        className="time-input"
        value={startTime || ""}
        onChange={handleStart}
      />
      <label htmlFor="endTime">to</label>
      <input
        type="time"
        name="endTime"
        id="end-time"
        className="time-input"
        value={endTime || ""}
        onChange={handleEnd}
      />
    </div>
  );
};
