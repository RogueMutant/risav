import React, { useState } from "react";
import { BsSearch, BsThreeDots } from "react-icons/bs";
import { nameInitials } from "../helper/helper";
import { User } from "../types/custom";
import "../styles/tableComponent.css";

interface TableProps {
  userData: Array<User>;
}

export const Table: React.FC<TableProps> = ({ userData }) => {
  const [searchBtn, setSearchBtn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const toggleSearchBtn = () => {
    setSearchBtn(!searchBtn);
  };

  const toggleDropdown = (userId: string) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId);
  };

  return (
    <>
      <div className="search-container">
        <div className={`search-bar ${searchBtn ? "open" : ""}`}>
          <input type="text" placeholder="Search by name or email" />
        </div>
        <BsSearch className="icon" onClick={toggleSearchBtn} />
      </div>

      {userData && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((userDetails: User) => (
                <tr key={userDetails._id}>
                  <td className="image-td">
                    {userDetails.profileImageUrl ? (
                      <img src={userDetails.profileImageUrl as string} alt="" />
                    ) : (
                      <span>{nameInitials(userDetails.name)}</span>
                    )}
                    <div>
                      <p>{userDetails.name || ""}</p>
                      <p>{userDetails.email || ""}</p>
                    </div>
                  </td>
                  <td>
                    <p>{userDetails.phoneNumber || "No number"}</p>
                  </td>
                  <td>
                    <p className="status-color">Active</p>
                  </td>
                  <td>
                    <div className="dropdown">
                      <BsThreeDots
                        className="icon"
                        onClick={() => toggleDropdown(userDetails._id)}
                      />
                      {dropdownOpen === userDetails._id && (
                        <div className="dropdown-content">
                          <button
                            onClick={() => alert(`Delete ${userDetails.name}`)}
                          >
                            Deactivate
                          </button>
                          <button
                            onClick={() => alert(`View ${userDetails.name}`)}
                          >
                            View
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
