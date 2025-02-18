import React, { useState } from "react";
import { useAuth } from "../components/authContext";

export const AllUsers = () => {
  const { user, error } = useAuth();

  return <div></div>;
};
