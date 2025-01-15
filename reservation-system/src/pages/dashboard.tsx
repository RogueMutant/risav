import React, { useEffect, useState } from "react";
import Fa from "react-icons/fa";
import Bs from "react-icons/bs";
import "../styles/index.css";

export const Dashboard = () => {
  return (
    <div className="main-container">
      <aside className="aside-nav">
        <nav className="side-nav">
          <div className="side-nav-header">
            <img src="" alt="" />
            <h2>RISAV</h2>
          </div>
          <div className="ul-list-container">
            <ul className="ul-content">
              <li>
                <Fa.FaHome /> <p>Dashboard</p>
              </li>
              <li>
                <Fa.FaUser /> <p>Profile</p>
              </li>
              <li>
                <Fa.FaCartPlus /> <p>Reservations</p>
              </li>
              <li>
                <Fa.FaFile /> <p>Categories</p>
              </li>
              <li>
                <Bs.BsGraphUp /> <p>Sales Report</p>
              </li>
              <li>
                <Bs.BsPeopleFill /> <p>Users</p>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      <div className="section-div-container">
        <section>
          <nav className="top-nav">
            <Bs.BsMenuAppFill />
            <Bs.BsSearch />
            <input type="text" name="" id="" />
            <Bs.BsBellFill />
            <button>
              <img src="" alt="" />
            </button>
            <button>
              <Bs.BsChevronDown />
            </button>
            <div className="dropdown-container">
              <ul className="dropdown-content">
                <li>
                  <Bs.BsPerson /> <p>View Profile</p>
                </li>
                <li>
                  <Bs.BsFillBellFill /> <p>Notifications</p>
                </li>
                <li>
                  <Bs.BsBoxArrowDownRight /> <p>Logout</p>
                </li>
              </ul>
            </div>
          </nav>
        </section>
        <section className="total-sales-container">
          {/* <h2></h2>
          <p></p>
          <div className="inner-sales-cont">
            <Bs.BsBarChartFill />
            <h3></h3>
            <p></p>
            <p></p>
          </div>
          <div className="inner-sales-cont">
            <Fa.FaTasks />
            <h3></h3>
            <p></p>
            <p></p>
          </div>
          <div className="inner-sales-cont">
            <Fa.FaCartPlus />
            <h3></h3>
            <p></p>
            <p></p>
          </div> */}
        </section>
        <section>
          <div></div>
        </section>
        <section>
          <div></div>
        </section>
        <section>
          <div></div>
        </section>
      </div>
    </div>
  );
};
