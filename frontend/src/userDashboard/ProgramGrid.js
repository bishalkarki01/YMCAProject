/** @format */

import React, { useState } from "react";
import "./userDashboard.css";
import defaultImage from "./YMCA.png";

const ProgramGrid = ({
  programs,
  onProgramSelect,
  isMember,
  handleRegister,
}) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleRegisterClick = (program) => {
    setSelectedProgram(program);
    setShowModal(true); // Show the modal with the question
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProgram(null);
  };

  const handleModalConfirm = () => {
    if (selectedProgram) {
      handleRegister(selectedProgram); // Proceed with the registration
    }
    handleModalClose(); // Close the modal after confirming
  };

  return (
    <div className="program-grid">
      {programs.map((program) => (
        <div
          key={program.id || program._id} // Handle both id and _id
          className="program-card"
          onClick={() => onProgramSelect(program)}>
          <div className="program-content">
            <img
              src={program.imageUrl || defaultImage}
              alt={program.programName}
              className="program-image"
            />
            <div className="program-text">
              <h3>{program.programName}</h3>
              <p>
                <strong>Start Date:</strong> {program.startDate} <br />
                <strong>End Date:</strong> {program.endDate} <br />
                <strong>Start Time:</strong> {program.startTime} <br />
                <strong>Location:</strong> {program.location} <br />
                <strong>Total Seats:</strong> {program.participants} <br />
                <strong>Price:</strong>{" "}
                {isMember
                  ? `$${program.memberPrice}`
                  : `$${program.nonMemberPrice}`}{" "}
                <br />
              </p>
              <button
                className="register-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents the card's onClick event
                  handleRegisterClick(program); // Open modal with question
                }}
                disabled={program.participants === 0} // Disable if no seats left
              >
                {program.participants === 0 ? "Registration Full" : "Register"}
              </button>
            </div>
          </div>
        </div>
      ))}

      {showModal && selectedProgram && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>{selectedProgram.question}</h4>
            <div className="modal-actions">
              <button className="yes-button" onClick={handleModalConfirm}>
                Yes
              </button>
              <button className="no-button" onClick={handleModalClose}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramGrid;
