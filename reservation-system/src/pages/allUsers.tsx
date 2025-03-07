import React, { useState, useEffect } from "react";
import { useAuth } from "../components/authContext";
import { Table } from "../components/tableComponent";
import "../styles/index.css";

export const AllUsers = () => {
  const { allUsers, getAllUsers, error, isLoading } = useAuth();
  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);
  return (
    <div className="resevation-info-container">
      {allUsers && (
        <div className="reservation-table-container">
          <div className="table-container">
            {error ? <p>error</p> : <Table userData={allUsers} />}
          </div>
        </div>
      )}
    </div>
  );
};
