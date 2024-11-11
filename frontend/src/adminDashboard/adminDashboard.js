/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminDashboard.css";
import ListofUser from "./ListofUser";
import ProgramList from "./ProgramList";
import RegisteredUsers from "./RegisteredUsers";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const firstName = localStorage.getItem("firstName");
  const loggedInUserId = localStorage.getItem("userId");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [view, setView] = useState("programs");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isNoticeModalOpen, setNoticeModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [dropdownUserId, setDropdownUserId] = useState(null);
  const [noticeText, setNoticeText] = useState("");
  const [formData, setFormData] = useState({
    programName: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    memberPrice: "",
    nonMemberPrice: "",
    description: "",
    location: "",
    participants: "",
    days: [],
    question: "",
  });
  const [isDateValid, setIsDateValid] = useState(true);

  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProgramId, setEditingProgramId] = useState(null);

  // Calculate tomorrow's date for minimum date restrictions
  const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const minStartDate = getTomorrowDate();
  const minEndDate = formData.startDate || minStartDate;

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
        startTime: program.startTime,
        endTime: program.endTime,
        memberPrice: program.memberPrice,
        nonMemberPrice: program.nonMemberPrice,
        description: program.description,
        location: program.location,
        participants: program.participants,
        days: program.days || [],
        question: program.question || "",
      });
    } else {
      setFormData({
        programName: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        memberPrice: "",
        nonMemberPrice: "",
        description: "",
        location: "",
        participants: "",
        days: [],
        question: "",
      });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProgramId(null);
  };

  // Function to open the notice modal
  const handleOpenNoticeModal = (program) => {
    setSelectedProgram(program);
    setNoticeText("");
    setNoticeModalOpen(true);
  };

  // Function to close the notice modal
  const handleCloseNoticeModal = () => {
    setNoticeModalOpen(false);
    setSelectedProgram(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDaysChange = (day) => {
    setFormData((prevData) => ({
      ...prevData,
      days: prevData.days.includes(day)
        ? prevData.days.filter((d) => d !== day)
        : [...prevData.days, day],
    }));
  };

  const validateDates = () => {
    const startDate = new Date(formData.startDate).setHours(0, 0, 0, 0);
    const endDate = new Date(formData.endDate).setHours(0, 0, 0, 0);

    // Check if end date is before start date
    if (endDate <= startDate) {
      setIsDateValid(false);
      alert("End Date must be after the Start Date.");
      return false;
    } else {
      setIsDateValid(true);
      return true;
    }
  };

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      validateDates();
    }
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDates()) return;

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

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      try {
        const response = await fetch("http://localhost:5001/logout", {
          method: "POST",
          credentials: "include", // Ensure cookies are sent with the request
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();

        if (result.msg === "ok") {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login", { replace: true });
          alert("Logged out successfully!");
        } else {
          alert("Failed to log out. Please try again.");
        }
      } catch (error) {
        console.error("Error logging out:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleIconClick = (userId) => {
    setDropdownUserId(dropdownUserId === userId ? null : userId); // Toggle dropdown
  };

  // Function to handle sending the notice
  const handleSendNotice = async () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3); // Set expiration to 3 days from now

    try {
      const response = await fetch(
        `http://localhost:5001/program/${selectedProgram._id}/sendNotice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            noticeText,
            expirationDate: expirationDate.toISOString(), // Send expiration date as ISO string
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Notice sent successfully to all enrolled users!");
        setNoticeModalOpen(false);
        setSelectedProgram(null);
      } else {
        alert("Failed to send notice. Please try again.");
      }
    } catch (error) {
      console.error("Error sending notice:", error);
      alert("An error occurred while sending the notice.");
    }
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
                  className={view === "allUser" ? "active" : ""}
                  onClick={() => setView("allUser")}>
                  <i className="fas fa-user"></i> List of Users
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
                onProgramNotice={handleOpenNoticeModal}
              />
            </>
          ) : (
            <></>
          )}
          {view === "users" && <RegisteredUsers />}
          {view === "allUser" && (
            <ListofUser loggedInUser={loggedInUser} />
          )}{" "}
          {/* Pass logged-in user */}
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
                    min={minStartDate}
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>End Date:</label>
                  <input
                    type="date"
                    name="endDate"
                    min={minEndDate}
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time:</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>End Time:</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Days:</label>
                  <div className="days-checkbox-group">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <label key={day}>
                        <input
                          type="checkbox"
                          checked={formData.days.includes(day)}
                          onChange={() => handleDaysChange(day)}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
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
                <div className="form-group full-width">
                  <label>Prerequisite:</label>
                  <input
                    type="text"
                    name="question"
                    placeholder="Enter a question for the program"
                    value={formData.question}
                    onChange={handleChange}
                  />
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
                <button type="submit" disabled={!isDateValid}>
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

      {isNoticeModalOpen && selectedProgram && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Enter Notice for {selectedProgram.programName}</h4>
            <input
              type="text"
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
              placeholder="Enter your notice here..."
            />
            <div className="modal-actions">
              <button className="send-button" onClick={handleSendNotice}>
                Send
              </button>
              <button
                className="cancel-button"
                onClick={handleCloseNoticeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
