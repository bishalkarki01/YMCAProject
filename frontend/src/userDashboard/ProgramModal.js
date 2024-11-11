/** @format */

import React, { useState } from "react";
import "./modal.css";

const ProgramModal = ({ program, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // State to track success

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // If userId is null, show an error or redirect
  if (!userId) {
    console.error("User is not logged in. Redirecting to login...");
    window.location.href = "/login";
    return null;
  }

  const handleConfirmRegistration = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:5001/program/registeredProgram",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: userId,
            programId: program._id,
            registrationDate: new Date().toISOString(),
            activeStatus: true, // Sending activeStatus as true
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register for the program");
      }

      // If the request was successful, set the success state
      setSuccess(true);
    } catch (error) {
      console.error("Error registering for the program:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate remaining seats based on total participants and active registrations
  const remainingSeats = program.participants - program.activeRegistrations;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Program Details</h2>

        {success ? (
          // Display success message if registration is successful
          <div>
            <p>Thank you for registering for the program!</p>
            <button className="close-modal-btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          // Show registration form if not yet registered
          <>
            <p>
              <strong>Program Name:</strong> {program.programName}
            </p>
            <p>
              <strong>Start Date:</strong> {program.startDate}
            </p>
            <p>
              <strong>End Date:</strong> {program.endDate}
            </p>
            <p>
              <strong>Location:</strong> {program.location}
            </p>
            <p>
              <strong>Remaining Seats:</strong> {remainingSeats}
            </p>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
              <p>Registering...</p>
            ) : remainingSeats > 0 ? (
              <button
                className="confirm-registration-btn"
                onClick={handleConfirmRegistration}>
                Confirm Registration
              </button>
            ) : (
              <p>Registration is full. No seats available.</p>
            )}

            <button className="close-modal-btn" onClick={onClose}>
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgramModal;
