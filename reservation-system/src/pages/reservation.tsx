import React from "react";
import "../styles/index.css";
import { BsFilter, BsFilterRight, BsSearch } from "react-icons/bs";

export const Reservation = () => {
  return (
    <div className="resevation-info-container">
      <div className="reserv-header">
        <div className="header-cont">
          <h2>Resrvation Lists</h2>
          <p>You have total 2,595 booking's.</p>
        </div>
        <BsFilterRight className="icon" />
      </div>

      <div className="search-container">
        <div className="inner-search">
          <BsSearch className="icon" />
          <input type="search" name="search" id="search" />
        </div>
        <BsFilter className="icon filter" />
      </div>

      <div className="reservation-table-container">
        <div className="table-container">
          <h2>Top Reservations</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>user</th>
                <th>Resource</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01</td>
                <td className="image-td">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/account/Profile.png`}
                    alt=""
                  />
                  <div>
                    <p>Solomon Grundy </p>
                    <p>solo@Gmail.com</p>
                  </div>
                </td>
                <td>
                  <p>Soccer Field</p>
                </td>
                <td>
                  <p className="status-color">Active</p>
                </td>
              </tr>
              <tr>
                <td>02</td>
                <td className="image-td">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/account/Profile.png`}
                    alt=""
                  />
                  <div>
                    <p>Elon musk </p>
                    <p>musk@Gmail.com</p>
                  </div>
                </td>
                <td>
                  <p>Gym shorts</p>
                </td>
                <td>
                  <p className="status-color">Pending</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
