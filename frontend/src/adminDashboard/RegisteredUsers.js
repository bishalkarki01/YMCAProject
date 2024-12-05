/**
 * Author : Bishal Karki // Isabella Breuhl 
 * Discription:REgistered user dashboard
 * Created : 13 November 2024
 * Last Modifies: 4  December 2024
 *
 * 
 */

import React, { useEffect, useState } from "react";
import "./REgisteredUser.css";

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:5001/program/users/");
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    };

    fetchUsers();
  }, []);

  // Function to apply all filters
  const applyFilters = () => {
    // Filter by status
    const statusFiltered = users.filter((user) => {
      if (filter === "Active") return user.status === true;
      if (filter === "Inactive") return user.status === false;
      return true; // "All"
    });

    // Filter by search text
    const searchFiltered = statusFiltered.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.programName.toLowerCase().includes(searchText.toLowerCase())
    );

    // Filter by date range
    const dateFiltered = searchFiltered.filter((user) => {
      const programStartDate = new Date(user.startDate);
      const programEndDate = new Date(user.endDate);

      const isWithinStartDate =
        !startDate || programStartDate >= new Date(startDate);
      const isWithinEndDate = !endDate || programEndDate <= new Date(endDate);

      return isWithinStartDate && isWithinEndDate;
    });

    setFilteredUsers(dateFiltered);
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    applyFilters();
  };

  // Handle search text change
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    applyFilters();
  };

  // Handle start date change
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    applyFilters();
  };

  // Handle end date change
  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    applyFilters();
  };

  return (
    <div>
      <div className="filter-section">
        <label htmlFor="user-filter">Filter users by status: </label>
        <select id="user-filter" value={filter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Cancelled</option>
        </select>

        <input
          type="text"
          placeholder="Search by name, email, or program"
          value={searchText}
          style={{
            marginLeft: "40px",
            width: "500px",
            padding: "10px",
          }}
          onChange={handleSearchChange}
          className="search-input"
        />

        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          style={{
            marginLeft: "40px",
            padding: "10px",
          }}
        />
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          style={{
            marginLeft: "20px",
            padding: "10px",
          }}
        />
      </div>

      <table className="program-table">
        <thead>
          <tr>
            <th>S.N</th>
            <th>Name</th>
            <th>Email</th>
            <th>Program Registered</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.programName}</td>
              <td>{user.startDate}</td>
              <td>{user.endDate}</td>
              <td>{user.status ? "Active" : "Cancelled"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisteredUsers;
