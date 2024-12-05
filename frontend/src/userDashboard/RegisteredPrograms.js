/**
 * Author : Bishal Karki
 * Discription:Page to fetch the list of registered  program by specific user
 * Created : 13 November 2024
 * Last Modifies: 4  December 2024
 *
 * 
 */
import React, { useEffect, useState } from "react";
import "./RegisteredProgram.css";

const RegisteredPrograms = ({ token, userId }) => {
  const [registeredPrograms, setRegisteredPrograms] = useState([]);
  const [familyPrograms, setFamilyPrograms] = useState([]);
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

    const fetchFamilyPrograms = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/program/familyPrograms?parentEmail=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("No family programs found.");
        }
        const data = await response.json();
        console.log("Family Programs Fetched:", data);
        setFamilyPrograms(data);
      } catch (error) {
        console.error("Error fetching family programs:", error.message);
        setError(error.message);
      }
    };

    fetchRegisteredPrograms();
    fetchFamilyPrograms();
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

  return (
    <div className="registered-programs">
      <h2>Your Registered Programs</h2>
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
          {registeredPrograms.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No programs registered yet.
              </td>
            </tr>
          ) : (
            registeredPrograms.map((program) => (
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
            ))
          )}
        </tbody>
      </table>

      <div className="registered-programs">
        <h2>Family Members' Programs</h2>
        <table className="registered-user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Program Name</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {familyPrograms.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No family programs registered yet.
                </td>
              </tr>
            ) : (
              familyPrograms.map((program) => (
                <tr key={program._id}>
                  <td>{program.name}</td>
                  <td>{program.participantEmail}</td>
                  <td>{program.programName}</td>
                  <td>{program.startDate}</td>
                  <td>{program.endDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisteredPrograms;
