/**
 * Author : Bishal Karki // Isabella Breuhl 
 * Discription:List of program list
 * Created : 13 November 2024
 * Last Modifies: 4  December 2024
 *
 * 
 */

import React from "react";

const ProgramList = ({
  programs,
  onProgramEdit,
  onProgramNotice,
  onProgramDelete,
}) => {
  return (
    <table className="program-table">
      <thead>
        <tr>
          <th>Program Name</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Location</th>
          <th>Notice</th>
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
            <td>{program.location}</td>
            <td>
              <button
                className="notice-btn"
                onClick={() => onProgramNotice(program)}>
                Send Notice
              </button>
            </td>
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
