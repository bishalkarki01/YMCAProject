/** @format */

import React, { useState } from "react";
import ProgramModal from "./ProgramModal";
import "./userDashboard.css";
import defaultImage from "./YMCA.png";

const PikeLevelModal = ({ onConfirm, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Pike Level Confirmation</h2>
        <p>Have you passed the Pike level?</p>
        <div className="pike-level-buttons">
          <button className="yes-btn" onClick={() => onConfirm(true)}>
            Yes
          </button>
          <button className="no-btn" onClick={() => onConfirm(false)}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Registration Error</h2>
        <p>{message}</p>
        <button className="close-modal-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const ProgramGrid = ({
  programs,
  onProgramSelect,
  isMember,
  handleRegister,
}) => {
  const [showPikeModal, setShowPikeModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const handleRegisterClick = (program) => {
    setSelectedProgram(program);
    setShowPikeModal(true);
  };

  const handlePikeConfirmation = (hasPassedPike) => {
    setShowPikeModal(false);

    if (hasPassedPike) {
      setShowProgramModal(true);
      setErrorMessage(null);
    } else {
      setErrorMessage(
        "You must pass the Pike level to register for this program."
      );
      setShowErrorModal(true);
    }
  };

  return (
    <div className="program-grid">
      {programs.map((program) => {
        const remainingSeats =
          program.participants - program.activeRegistrations;

        return (
          <div
            key={program.id || program._id}
            className={`program-card ${remainingSeats === 0 ? "full" : ""}`}>
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
                  <strong>Time:</strong> {program.time} <br />
                  <strong>Location:</strong> {program.location} <br />
                  <strong>Total Seats:</strong> {program.participants} <br />
                  <strong>Remaining Seats:</strong> {remainingSeats} <br />
                  <strong>Price:</strong>{" "}
                  {isMember
                    ? `$${program.memberPrice}`
                    : `$${program.nonMemberPrice}`}{" "}
                  <br />
                </p>
                <button
                  className="register-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the card's onClick event
                    handleRegisterClick(program); // Show Pike level modal
                  }}
                  disabled={remainingSeats === 0}>
                  {remainingSeats === 0 ? "Registration Full" : "Register"}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Pike Level Modal */}
      {showPikeModal && (
        <PikeLevelModal
          onConfirm={handlePikeConfirmation}
          onClose={() => setShowPikeModal(false)}
        />
      )}

      {/* Program Modal (only if Pike level is passed) */}
      {showProgramModal && selectedProgram && (
        <ProgramModal
          program={selectedProgram}
          onClose={() => setShowProgramModal(false)}
        />
      )}

      {/* Error Modal (if user cannot register) */}
      {showErrorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default ProgramGrid;
