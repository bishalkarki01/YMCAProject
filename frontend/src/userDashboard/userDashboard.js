/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgramGrid from "./ProgramGrid.js";
import ProgramModal from "./ProgramModal"; // Import the modal component
import RegisteredPrograms from "./RegisteredPrograms"; // Import the registered programs component
import "./userDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null); // Track selected program for the modal
  const [view, setView] = useState("programs"); // To switch between "Program List" and "Registered Programs"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMember, setIsMember] = useState(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const firstName = localStorage.getItem("firstName");

  // Fetch programs and membership status for participants
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("http://localhost:5001/program", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch programs");
        }
        const data = await response.json();
        setPrograms(data); // Set the fetched data
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
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch membership status");
          }
          const result = await response.json();
          setIsMember(result.isMember); // Set membership status
        } catch (error) {
          console.error("Error fetching membership status:", error);
        }
      }
    };

    fetchPrograms();
    fetchIsMemberStatus();
  }, [role, token]);

  // Handle the program registration click, open the modal
  const handleRegister = (program) => {
    setSelectedProgram(program);
  };

  // Close the modal
  const handleCloseModal = () => {
    setSelectedProgram(null);
  };

  // Handle switching between program list and registered programs
  const handleViewChange = (view) => {
    setView(view);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Conditional rendering based on loading or error state
  if (loading) {
    return <div>Loading programs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="user-dashboard">
      <header className="header">
        <h1>Welcome to YMCA Program {firstName}</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

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
