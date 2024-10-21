/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminDashboard.css";
import ProgramList from "./ProgramList";
import RegisteredUsers from "./RegisteredUsers";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const firstName = localStorage.getItem("firstName");
  const [view, setView] = useState("programs");
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    programName: "",
    startDate: "",
    endDate: "",
    time: "",
    memberPrice: "",
    nonMemberPrice: "",
    description: "",
    location: "",
    participants: "",
  });

  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProgramId, setEditingProgramId] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      const response = await fetch("http://localhost:5001/program/");
      const data = await response.json();
      setPrograms(data);
    };

    fetchPrograms();
  }, []);

  const handleOpenModal = (program = null) => {
    setModalOpen(true);
    if (program) {
      setEditingProgramId(program._id);
      setFormData({
        programName: program.programName,
        startDate: program.startDate,
        endDate: program.endDate,
        time: program.time,
        memberPrice: program.memberPrice,
        nonMemberPrice: program.nonMemberPrice,
        description: program.description,
        location: program.location,
        participants: program.participants,
      });
    } else {
      setFormData({
        programName: "",
        startDate: "",
        endDate: "",
        time: "",
        memberPrice: "",
        nonMemberPrice: "",
        description: "",
        location: "",
        participants: "",
      });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProgramId(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProgramId) {
      const response = await fetch(
        `http://localhost:5001/program/${editingProgramId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (result.success) {
        const updatedResponse = await fetch("http://localhost:5001/program/");
        const updatedData = await updatedResponse.json();
        setPrograms(updatedData);
        handleCloseModal();
        alert("Program updated successfully!");
      } else {
        alert("Failed to update program. Please try again.");
      }
    } else {
      const response = await fetch(
        "http://localhost:5001/program/programRegister",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (result.success) {
        const updatedResponse = await fetch("http://localhost:5001/program/");
        const updatedData = await updatedResponse.json();
        setPrograms(updatedData);
        handleCloseModal();
        alert("Program saved successfully!");
      } else {
        alert("Failed to save program. Please try again.");
      }
    }
  };

  const handleDelete = async (programId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this program?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5001/program/${programId}`,
          {
            method: "DELETE",
          }
        );
        const result = await response.json();
        if (result.success) {
          const updatedResponse = await fetch("http://localhost:5001/program/");
          const updatedData = await updatedResponse.json();
          setPrograms(updatedData);
          alert("Program deleted successfully!");
        } else {
          alert("Failed to delete program. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting program:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Filter programs based on search term
  const filteredPrograms = programs.filter((program) =>
    program.programName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-container">
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
                  href="adminDashboard"
                  className={view === "programs" ? "active" : ""}
                  onClick={() => setView("programs")}>
                  <i className="fas fa-list"></i> Program List
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={view === "users" ? "active" : ""}
                  onClick={() => setView("users")}>
                  <i className="fas fa-users"></i> Registered Users
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="container">
          {view === "programs" ? (
            <>
              {/* Search Box */}
              <div className="search-add-container">
                <input
                  type="text"
                  placeholder="Search Programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-box"
                />
                <button
                  className="add-program-btn"
                  onClick={() => handleOpenModal()}>
                  Add Program
                </button>
              </div>

              <ProgramList
                programs={filteredPrograms}
                onProgramEdit={handleOpenModal}
                onProgramDelete={handleDelete}
              />
            </>
          ) : (
            <RegisteredUsers />
          )}
        </main>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingProgramId ? "Update Program" : "Add New Program"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Program Name:</label>
                  <input
                    type="text"
                    name="programName"
                    placeholder="Enter Program Name"
                    value={formData.programName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>End Date:</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Program Time:</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Member Price:</label>
                  <input
                    type="number"
                    name="memberPrice"
                    placeholder="Price for Members"
                    value={formData.memberPrice}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Non-Member Price:</label>
                  <input
                    type="number"
                    name="nonMemberPrice"
                    placeholder="Price for Non-Members"
                    value={formData.nonMemberPrice}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    placeholder="Program Description"
                    value={formData.description}
                    onChange={handleChange}></textarea>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location:</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter Location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Max Participants:</label>
                  <input
                    type="number"
                    name="participants"
                    placeholder="Max Participants"
                    value={formData.participants}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit">
                  {editingProgramId ? "Update" : "Save"}
                </button>
                <button type="button" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
