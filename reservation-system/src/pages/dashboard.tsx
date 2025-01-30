import React, { useEffect, useState } from "react";
import { FaHome, FaUser, FaFile, FaCartPlus, FaTasks } from "react-icons/fa";
import {
  BsGraphUp,
  BsPeopleFill,
  BsGridFill,
  BsSearch,
  BsPerson,
  BsBellFill,
  BsFillBellFill,
  BsChevronDown,
  BsChevronLeft,
  BsChevronRight,
  BsBoxArrowRight,
  BsBarChartFill,
  BsBoxArrowInLeft,
  BsPersonAdd,
} from "react-icons/bs";
import "../styles/index.css";
import toggleNav from "../components/buttons";
declare var axios: any;

export const Dashboard = () => {
  const [dropdownsOpen, setDropdownsOpen] = useState<{
    reservations: boolean;
    categories: boolean;
    salesReport: boolean;
  }>({
    reservations: false,
    categories: false,
    salesReport: false,
  });

  const toggleDropdown = (dropdownName: keyof typeof dropdownsOpen) => {
    setDropdownsOpen((prevState) => {
      const newState = { ...prevState };
      for (const key in prevState) {
        if (prevState.hasOwnProperty(key)) {
          newState[key as keyof typeof prevState] =
            key === dropdownName
              ? !prevState[key as keyof typeof prevState]
              : false;
        }
      }
      return newState;
    });
  };

  const handleAsideClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) {
      toggleNav("aside-nav", "slide-out");
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="top-nav">
        <div className="left">
          <BsGridFill
            className="icon"
            style={{ cursor: "pointer" }}
            onClick={() => toggleNav("aside-nav", "slide-out")}
          />
          <BsSearch className="icon" style={{ cursor: "pointer" }} />
          <input type="text" name="" id="" />
        </div>
        <div className="right">
          <BsBellFill className="icon" style={{ cursor: "pointer" }} />
          <img
            style={{ marginRight: "0.9em" }}
            src={`${process.env.PUBLIC_URL}/images/account/Profile.png`}
            alt="user"
          />
          <BsChevronDown
            className="icon"
            style={{ cursor: "pointer" }}
            onClick={() => toggleNav("dropdown-container", "dropdown-display")}
          />
          <div className="dropdown-container">
            <ul className="dropdown-content">
              <li>
                <BsPerson className="icon" /> <p>Manage Profile</p>
              </li>
              <li>
                <BsFillBellFill className="icon" /> <p>Notifications</p>
              </li>
              <li>
                <BsBoxArrowRight style={{ color: "red" }} className="icon" />
                <p style={{ color: "red" }}>Logout</p>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <aside className="aside-nav" onClick={handleAsideClick}>
        <nav className="side-nav slide-out">
          <div className="side-nav-header">
            <h2>RISAV</h2>
          </div>
          <div className="ul-list-container">
            <ul className="ul-content">
              <li>
                <FaHome className="icon" /> <p>Dashboard</p>
              </li>
              <li>
                <FaUser className="icon" /> <p>Profile</p>
              </li>

              <li className="dropdown">
                <div
                  className="dropdown-btn"
                  onClick={() => toggleDropdown("reservations")}
                >
                  <div>
                    <FaCartPlus className="icon" /> <p>Reservations</p>
                  </div>
                  <BsChevronRight className="icon-right" />
                </div>
                {dropdownsOpen.reservations && (
                  <ul className="dropdown-list">
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("All Reservations clicked");
                      }}
                    >
                      All Reservations
                    </li>
                  </ul>
                )}
              </li>

              <li className="dropdown">
                <div
                  className="dropdown-btn"
                  onClick={() => toggleDropdown("categories")}
                >
                  <div>
                    <FaFile className="icon" />
                    <p>Categories</p>
                  </div>
                  <BsChevronRight className="icon-right" />
                </div>
                {dropdownsOpen.categories && (
                  <ul className="dropdown-list">
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Lab Equipment clicked");
                      }}
                    >
                      Lab Equipment
                    </li>
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("+ Create New Category clicked");
                      }}
                    >
                      + Create New Category
                    </li>
                  </ul>
                )}
              </li>

              <li className="dropdown">
                <div
                  className="dropdown-btn"
                  onClick={() => toggleDropdown("salesReport")}
                >
                  <div>
                    <BsGraphUp className="icon" /> <p>Sales Report</p>
                  </div>
                  <BsChevronRight className="icon-right" />
                </div>
                {dropdownsOpen.salesReport && (
                  <ul className="dropdown-list">
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      All Reservations
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <BsPeopleFill className="icon" /> <p>Users</p>
              </li>
              <li>
                <BsBoxArrowInLeft className="icon" /> <p>Login</p>
              </li>
              <li>
                <BsPersonAdd className="icon" /> <p>Sign up</p>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      <div className="section-div-container">
        <section className="total-sales-container">
          <h2>Reservation's Summary</h2>
          <div className="inner-sales-cont">
            <BsBarChartFill style={{ color: "#fab659" }} className="icon" />
            <h3>$5k</h3>
            <p>Income From Reservations</p>
          </div>
          <div className="inner-sales-cont">
            <FaTasks style={{ color: "#a0dfd8" }} className="icon" />
            <h3>500</h3>
            <p>Total Applications</p>
          </div>
          <div className="inner-sales-cont">
            <FaCartPlus style={{ color: "#e4c8ed" }} className="icon" />
            <h3>9</h3>
            <p>Total Reservations</p>
          </div>
        </section>
        <section className="top-reservations-container">
          <div className="table-container">
            <h2>Top Reservations</h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Popularity</th>
                  <th>Sales</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>01</td>
                  <td>Kitchen Convention</td>
                  <td>
                    <div className="progress-bar"></div>
                  </td>
                  <td>
                    <div className="sales-percentage">
                      <p>78%</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>02</td>
                  <td>Sports Track</td>
                  <td>
                    <div className="progress-bar"></div>
                  </td>
                  <td>
                    <div className="sales-percentage">
                      <p>62%</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="trending-section">
          <div className="trending-container">
            <div className="header">
              <h2>Trending Now</h2>
              <div className="next-prev-cont">
                <BsChevronLeft style={{ marginRight: "1.5em" }} />
                <BsChevronRight />
              </div>
            </div>
            <div className="image-container">
              {/* image dey here */}
              <h3>Kitchen Convention</h3>
              <p>Popularity</p>
              <div className="progress-bar"></div>
              <div className="user-icon"></div>
            </div>
          </div>
        </section>
        <section>
          <div></div>
        </section>
      </div>
    </div>
  );
};
