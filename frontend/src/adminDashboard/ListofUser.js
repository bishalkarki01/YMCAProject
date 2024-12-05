/**
 * Author : Bishal Karki
 * Discription:List of user
 * Created : 13 November 2024
 * Last Modifies: 4  December 2024
 *
 * 
 */

import React, { useEffect, useState } from "react";
import "./REgisteredUser.css";

const ListofUser = ({ loggedInUserId }) => {
  const [users, setUsers] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState({});
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

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

        // Initialize checkedUsers state based on isVerified field
        const initialCheckedUsers = {};
        data.forEach((user) => {
          initialCheckedUsers[user._id] = user.isVerified || false;
        });

        setUsers(data);
        setFilteredUsers(data);
        setCheckedUsers(initialCheckedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
        setFilteredUsers([]);
      }
    };

    fetchUser();
  }, [loggedInUserId]);

  // Handle checkbox toggle
  const handleCheckboxChange = async (userId) => {
    const isChecked = !checkedUsers[userId];

    try {
      const response = await fetch(
        `http://localhost:5001/updateUser/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ isVerified: isChecked }),
        }
      );

      if (response.ok) {
        // Update the local state only if the API call succeeds
        setCheckedUsers((prevState) => ({
          ...prevState,
          [userId]: isChecked,
        }));

        // Optionally, update the users list to reflect the change
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isVerified: isChecked } : user
          )
        );
        setFilteredUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isVerified: isChecked } : user
          )
        );
      } else {
        console.error("Failed to update user verification status.");
      }
    } catch (error) {
      console.error("Error updating user verification status:", error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);

    // Filter users based on search text
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchValue) ||
        user.lastName.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div>
      <h2>List of Users</h2>
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchText}
        onChange={handleSearchChange}
        className="search-input"
        style={{
          width: "80%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Verified</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
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
                  checked={!!checkedUsers[user._id]}
                  onChange={() => handleCheckboxChange(user._id)}
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
