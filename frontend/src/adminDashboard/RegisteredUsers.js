/** @format */

import React, { useEffect, useState } from "react";
import "./REgisteredUser.css";

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:5001/program/users/");
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5001/program/user/${userId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          setUsers(users.filter((user) => user._id !== userId));
        } else {
          throw new Error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Apply filter based on filter selection
  const filteredUsers = users.filter((user) => {
    if (filter === "Active") return user.status === true;
    if (filter === "Inactive") return user.status === false;
    return true;
  });

  return (
    <div>
      <div className="filter-section">
        <label htmlFor="user-filter">Filter users by status: </label>
        <select id="user-filter" value={filter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Cancelled</option>
        </select>
      </div>

      <table className="program-table">
        <thead>
          <tr>
            <th>S.N</th>
            <th>Name</th>
            <th>Email</th>
            <th>Program Registered</th>
            <th>Status</th>
            {/* <th>Delete</th> */}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td> {/* Display incrementing number */}
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.programName}</td>
              <td>{user.status ? "Active" : "Cancelled"}</td>{" "}
              {/* Status as text */}
              {/* <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user._id)}>
                  Delete
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisteredUsers;
