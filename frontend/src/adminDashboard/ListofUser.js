/** @format */

import React, { useEffect, useState } from "react";
import "./REgisteredUser.css";

const ListofUser = ({ loggedInUserId }) => {
  const [users, setUsers] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5001/getUsers", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log("Fetched data:", data);

        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchUser();
  }, [loggedInUserId]);

  // Handle checkbox toggle
  const handleCheckboxChange = (userId) => {
    setCheckedUsers((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId], // Toggle the checked state
    }));
  };
  return (
    <div>
      <h2>List of Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td> {/* Display incrementing number */}
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <input
                  type="checkbox"
                  checked={!!checkedUsers[user._id]} // Check if user is selected
                  onChange={() => handleCheckboxChange(user._id)} // Toggle selection
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListofUser;
