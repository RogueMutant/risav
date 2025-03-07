import React, { useEffect, useState } from "react";
import { FaHome, FaUser, FaFile, FaCartPlus, FaTasks } from "react-icons/fa";
import {
  BsGraphUp,
  BsPeopleFill,
  BsGridFill,
  BsSearch,
  BsBellFill,
  BsFillBellFill,
  BsChevronDown,
  BsChevronLeft,
  BsChevronRight,
  BsBoxArrowRight,
  BsBarChartFill,
  BsGearFill,
  BsPersonAdd,
  BsPersonFill,
} from "react-icons/bs";
import "../styles/index.css";
import toggleNav from "../components/buttons";
import { CreateCategory } from "../components/createCategory";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/authContext";
import { useFetch } from "../hooks/useFetch";
import { nameInitials } from "../helper/helper";

const url = "/api/categories";

export const Dashboard = () => {
  const [dropdownsOpen, setDropdownsOpen] = useState<{
    reservations: boolean;
    categories: boolean;
    Report: boolean;
  }>({
    reservations: false,
    categories: false,
    Report: false,
  });
  const { fetchData, loading, error } = useFetch(url, false, "get");
  const [categories, setCategories] = useState<string[]>([]);
  const [searchBtn, setSearchBtn] = useState(false);

  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { user, userCategories, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSearchBtn = () => {
    setSearchBtn(!searchBtn);
  };

  const userImg = user?.profileImageUrl ?? undefined;
  let unformattedInitials = user?.name || undefined;
  console.log(unformattedInitials);

  const formattedInitials = nameInitials(unformattedInitials);

  // function to toggle the dropdowns
  const toggleDropdown = (dropdownName: string) => {
    setDropdownsOpen((prevState) => {
      const newState = { ...prevState };
      for (const key in newState) {
        newState[key as keyof typeof prevState] = false;
      }
      newState[dropdownName as keyof typeof prevState] =
        !prevState[dropdownName as keyof typeof prevState];
      return newState;
    });
  };

  // function to handle the click event on the aside nav
  const handleAsideClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) {
      toggleNav("aside-nav", "slide-out");
    }
  };

  const handleCreateCategory = (categoryName: string) => {
    console.log("Category Name: ", categoryName);
    setCategories((prevState) => [...prevState, categoryName]);
    setShowCreateCategory(false);
  };

  const handleLogOut = async (): Promise<void> => {
    await logout();
    navigate("/login");
  };
  useEffect(() => {
    if (userCategories) {
      const newCategories: string[] = [];
      userCategories.map((categories) => {
        return newCategories.push(categories.name);
      });
      setCategories(newCategories);
    }
  }, [userCategories]);
  return (
    <div className="dashboard-container">
      <nav className="top-nav">
        <div className="left">
          <BsGridFill
            className="icon"
            style={{ cursor: "pointer" }}
            onClick={() => toggleNav("aside-nav", "slide-out")}
          />
          <BsSearch
            className="icon"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSearchBtn()}
          />
          {searchBtn && <input className="open" type="text" name="" id="" />}
        </div>
        <div className="right">
          <BsBellFill className="icon" style={{ cursor: "pointer" }} />
          <div
            className="image-wrapper"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/profile")}
          >
            {userImg ? (
              <img src={userImg as string} alt="user" />
            ) : (
              <span>{formattedInitials || "-"}</span>
            )}
          </div>
          <BsChevronDown
            className="icon"
            style={{ cursor: "pointer" }}
            onClick={() => toggleNav("dropdown-container", "dropdown-display")}
          />
          <div className="dropdown-container">
            <ul className="dropdown-content">
              <li>
                <BsPersonFill className="icon" />
                <p onClick={() => navigate("/profile")}>Manage Profile</p>
              </li>
              <li>
                <BsFillBellFill className="icon" />
                <p>Notifications</p>
              </li>
              <li>
                <BsBoxArrowRight style={{ color: "red" }} className="icon" />
                <p style={{ color: "red" }} onClick={handleLogOut}>
                  Logout
                </p>
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
              <li onClick={() => navigate("/profile")}>
                <FaUser className="icon" /> <p>Profile</p>
              </li>

              {/*  Reservations dropdown */}
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
                  <ul
                    className={`dropdown-list ${
                      dropdownsOpen.reservations ? "open" : ""
                    }`}
                  >
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/reservation/All-Reservations");
                        console.log("All Reservations clicked");
                      }}
                    >
                      All Reservations
                    </li>
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/reservation/Current-Reservation");
                        console.log("Current Reservations clicked");
                      }}
                    >
                      Current Reservations
                    </li>
                  </ul>
                )}
              </li>

              {/*  Categories dropdown */}
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
                  <ul
                    className={`dropdown-list ${
                      dropdownsOpen.categories ? "open" : ""
                    }`}
                  >
                    {loading
                      ? "Loading..."
                      : categories.map((categoryName, index) => {
                          return (
                            <li
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCategory(categoryName);
                                navigate(`/category/${categoryName}`);
                              }}
                              key={index}
                            >
                              {categoryName}
                            </li>
                          );
                        })}
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCreateCategory(true);
                        console.log("+ Create New Category clicked");
                      }}
                    >
                      + Create New Category
                    </li>
                  </ul>
                )}
              </li>

              {/* Report dropdown */}
              <li className="dropdown">
                <div
                  className="dropdown-btn"
                  onClick={() => toggleDropdown("Report")}
                >
                  <div>
                    <BsGraphUp className="icon" /> <p>Report</p>
                  </div>
                  <BsChevronRight className="icon-right" />
                </div>
                {dropdownsOpen.Report && (
                  <ul
                    className={`dropdown-list ${
                      dropdownsOpen.Report ? "open" : ""
                    }`}
                  >
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      Rervations Report
                    </li>
                  </ul>
                )}
              </li>
              <li onClick={() => navigate("/all-users")}>
                <BsPeopleFill className="icon" /> <p>Users</p>
              </li>
              <li onClick={() => navigate("/signUp")}>
                <BsPersonAdd className="icon" />
                <p>Sign up</p>
              </li>
              <li className="settings" onClick={() => navigate("/settings")}>
                <BsGearFill className="icon" />
                <p>Settings</p>
              </li>
            </ul>
          </div>
        </nav>

        {showCreateCategory && (
          <CreateCategory
            onCreated={handleCreateCategory}
            onCancel={() => setShowCreateCategory(false)}
          />
        )}
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
