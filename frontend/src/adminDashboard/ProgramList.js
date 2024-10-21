/** @format */

import React from "react";

const ProgramList = ({ programs, onProgramEdit, onProgramDelete }) => {
  return (
    <table className="program-table">
      <thead>
        <tr>
          <th>Program Name</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Time</th>
          <th>Location</th>
          <th>Update Details</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {programs.map((program) => (
          <tr key={program._id}>
            <td>{program.programName}</td>
            <td>{program.startDate}</td>
            <td>{program.endDate}</td>
            <td>{program.time}</td>
            <td>{program.location}</td>
            <td>
              <button
                className="update-btn"
                onClick={() => onProgramEdit(program)}>
                Update
              </button>
            </td>
            <td>
              <button
                className="delete-btn"
                onClick={() => onProgramDelete(program._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProgramList;
