import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div>
      <h1>Oops, there is no such route</h1>
      <Link to="/dashboard">click me to go back</Link>
    </div>
  );
};
