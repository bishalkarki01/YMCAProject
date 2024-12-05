/**
 * Author : Bishal Karki
 * Discription:Program registration page by the user
 * Created : 13 November 2024
 * Last Modifies: 4  December 2024
 *
 * 
 */
import React, { useState } from "react";
import "./modal.css";

const ProgramModal = ({ program, onClose, isAbove18 }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parentEmail, setParentEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [success, setSuccess] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  // Redirect if user is not logged in
  if (!userId) {
    console.error("User is not logged in. Redirecting to login...");
    window.location.href = "/login";
    return null;
  }

  const handleConfirmRegistration = async () => {
    // Validate parent's email if user is under 18
    if (!isAbove18 && !parentEmail) {
      setEmailError("Parent's email is required.");
      return;
    }

    if (!isAbove18 && !validateEmail(parentEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

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
            parentEmail: parentEmail,
            registrationDate: new Date().toISOString(),
            activeStatus: true,
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

            {/* Conditional rendering for parent's email */}
            {!isAbove18 && (
              <>
                <h4>Enter your parent's email address:</h4>
                <input
                  type="email"
                  placeholder="Parent's Email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  style={{
                    width: "80%",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                />
                {emailError && <p className="error-message">{emailError}</p>}
              </>
            )}

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
