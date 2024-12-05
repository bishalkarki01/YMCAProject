/**
 * Author : Bishal Karki // Isabella Breuhl 
 * Discription: Home page which can be seen by user after successful login 
 * Created : 13 November 2024
 * Last Modifies: 4  December 2024
 *
 * 
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgramGrid from "./ProgramGrid.js";
import ProgramModal from "./ProgramModal";
import RegisteredPrograms from "./RegisteredPrograms";
import "./userDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [view, setView] = useState("programs");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const firstName = localStorage.getItem("firstName");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("http://localhost:5001/program", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch programs");
        const data = await response.json();
        setPrograms(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchIsMemberStatus = async () => {
      if (role === "participant") {
        try {
          const response = await fetch(
            "http://localhost:5001/user/member-status",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!response.ok)
            throw new Error("Failed to fetch membership status");
          const result = await response.json();
          setIsMember(result.isMember);
        } catch (error) {
          console.error("Error fetching membership status:", error);
        }
      }
    };

    // Fetch notifications specific to the user's enrolled programs
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/program/${userId}/notifications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchPrograms();
    fetchIsMemberStatus();
    fetchNotifications();
  }, [role, token, userId]);

  const handleRegister = (program) => setSelectedProgram(program);
  const handleCloseModal = () => setSelectedProgram(null);
  const handleViewChange = (view) => setView(view);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const toggleNotifications = () => setShowNotifications((prev) => !prev);

  if (loading) return <div>Loading programs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-dashboard">
      <header className="header">
        <h1>Welcome to YMCA Program {firstName}</h1>
        <div className="header-actions">
          <button className="notification-btn" onClick={toggleNotifications}>
            Notifications ({notifications.length})
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="notification-dropdown">
          <h4>Notifications</h4>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification) => (
                <li key={notification._id}>
                  <strong>{notification.programId.programName}:</strong>{" "}
                  {notification.noticeText}
                </li>
              ))}
            </ul>
          ) : (
            <p>No new notifications</p>
          )}
        </div>
      )}

      <div className="content-wrapper">
        <aside className="sidebar">
          <nav>
            <ul>
              <li>
                <a
                  href="#"
                  className={view === "programs" ? "active" : ""}
                  onClick={() => handleViewChange("programs")}>
                  <i className="fas fa-list"></i> Program List
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={view === "registeredPrograms" ? "active" : ""}
                  onClick={() => handleViewChange("registeredPrograms")}>
                  <i className="fas fa-check"></i> Registered Programs
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="container">
          {view === "programs" ? (
            <div className="content">
              <ProgramGrid
                programs={programs}
                onProgramSelect={() => {}}
                isMember={role === "participant" ? isMember : false}
                handleRegister={handleRegister}
              />
            </div>
          ) : (
            <RegisteredPrograms token={token} userId={userId} />
          )}
        </main>
      </div>

      {selectedProgram && (
        <ProgramModal program={selectedProgram} onClose={handleCloseModal} />
      )}

      <footer className="footer">
        <p>&copy; 2024 YMCA Program Management</p>
      </footer>
    </div>
  );
};

export default UserDashboard;
