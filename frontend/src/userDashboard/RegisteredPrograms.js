/** @format */

import React, { useEffect, useState } from "react";
import "./RegisteredProgram.css"; // Assuming the above CSS is saved in this file

const RegisteredPrograms = ({ token, userId }) => {
  const [registeredPrograms, setRegisteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegisteredPrograms = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/program/registeredPrograms/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("You have not registered for any program.");
        }
        const data = await response.json();
        setRegisteredPrograms(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredPrograms();
  }, [token, userId]);

  const handleCancelRegistration = async (programId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/program/cancelRegistration/${userId}/${programId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to cancel registration.");
      }

      // Update the list to reflect the cancellation
      setRegisteredPrograms((prevPrograms) =>
        prevPrograms.map((program) =>
          program._id === programId
            ? { ...program, activeStatus: false }
            : program
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to check if 48 hours have passed since registration
  const isCancellable = (registrationDate) => {
    const now = new Date();
    const registrationTime = new Date(registrationDate);
    const timeDiffInMs = now - registrationTime;
    const hoursDiff = timeDiffInMs / (1000 * 60 * 60);
    return hoursDiff <= 48;
  };

  if (loading) {
    return <div>Loading registered programs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="registered-programs">
      <h2>Your Registered Programs</h2>
      {registeredPrograms.length === 0 ? (
        <p>No programs registered yet.</p>
      ) : (
        <table className="registered-user-table">
          <thead>
            <tr>
              <th>Program Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Cancel Registration</th>
            </tr>
          </thead>
          <tbody>
            {registeredPrograms.map((program) => (
              <tr key={program._id}>
                <td>{program.programName}</td>
                <td>{program.startDate}</td>
                <td>{program.endDate}</td>
                <td>
                  {program.activeStatus ? (
                    isCancellable(program.registrationDate) ? (
                      <button
                        className="delete-btn"
                        onClick={() => handleCancelRegistration(program._id)}>
                        Cancel Registration
                      </button>
                    ) : (
                      <span className="cannot-cancel-text">
                        Cannot cancel after 48 hours
                      </span>
                    )
                  ) : (
                    <span className="cancelled-text">Cancelled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RegisteredPrograms;
