/**
 * Author : Bishal Karki // Isabella Breuhl 
 * Discription:Program Grid
 * Created : 13 November 2024
 * Last Modifies: 4  December 2024
 *
 * 
 */

import React, { useState } from "react";
import ProgramModal from "./ProgramModal";
import "./userDashboard.css";
import defaultImage from "./YMCA.png";

const ProgramGrid = ({
  programs,
  onProgramSelect,
  isMember,
  handleRegister,
}) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [isAbove18, setIsAbove18] = useState(null);

  const handleRegisterClick = (program) => {
    setSelectedProgram(program);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProgram(null);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    setShowModal2(true);
  };

  const handleModal2Confirm = () => {
    setIsAbove18(true);
    setShowModal2(false);
    setShowProgramModal(true);
  };

  const handleModal2Close = () => {
    setIsAbove18(false);
    setShowModal2(false);
    setShowProgramModal(true);
  };

  const handleProgramModalClose = () => {
    setShowProgramModal(false);
    setSelectedProgram(null);
  };

  const getProgramStatus = (startDate, endDate) => {
    const currentDate = new Date();
    const programStartDate = new Date(startDate);
    const programEndDate = new Date(endDate);

    if (currentDate > programEndDate) {
      return "Completed";
    } else if (
      currentDate >= programStartDate &&
      currentDate <= programEndDate
    ) {
      return "Currently Running";
    }
    return "Upcoming";
  };

  return (
    <div className="program-grid">
      {programs.map((program) => {
        const programStatus = getProgramStatus(
          program.startDate,
          program.endDate
        );

        return (
          <div
            key={program.id || program._id}
            className={`program-card ${programStatus.toLowerCase()}`}
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
                  <strong>Status:</strong> {programStatus}
                </p>
                <button
                  className="register-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegisterClick(program);
                  }}
                  disabled={
                    programStatus !== "Upcoming" || program.participants === 0
                  } // Disable if not Upcoming or no seats left
                >
                  {programStatus === "Completed"
                    ? "Program Completed"
                    : programStatus === "Currently Running"
                    ? "Currently Running"
                    : program.participants === 0
                    ? "Registration Full"
                    : "Register"}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* First Modal */}
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

      {/* Second Modal */}
      {showModal2 && selectedProgram && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Are you above 18 years old?</h4>
            <div className="modal-actions">
              <button className="yes-button" onClick={handleModal2Confirm}>
                Yes
              </button>
              <button className="no-button" onClick={handleModal2Close}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Program Modal */}
      {showProgramModal && selectedProgram && (
        <ProgramModal
          program={selectedProgram}
          isAbove18={isAbove18}
          onClose={handleProgramModalClose}
        />
      )}
    </div>
  );
};

export default ProgramGrid;
