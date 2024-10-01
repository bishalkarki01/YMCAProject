/** @format */

import axios from "axios";
import React, { useState } from "react";
import InputMask from "react-input-mask";
import { Link, useNavigate } from "react-router-dom";
import "./registration.css";

function RegistrationPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [newEmail, setEmail] = useState("");
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [errorMessage, setErrorMessage] = useState("");
  const [isMember, setIsMember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match!"); // Show error if passwords don't match
      return; // Prevent form submission
    }

    const userData = {
      firstName,
      lastName,
      address: `${street}, ${city}, ${state}, ${zip}`,
      phone,
      email: newEmail,
      password: newPassword,
      userType: "participant",
      member: isMember,
    };

    try {
      const response = await axios.post(
        "http://localhost:5001/register",
        userData
      );
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Please fill the form completely");
      }
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <div className="register-card">
          <h2>REGISTRATION</h2>
          {errorMessage && <div className="error">{errorMessage}</div>}
          <div className="row">
            <input
              type="text"
              className="form-control"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
            <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
          {/* Address Row */}
          <div className="row">
            <input
              type="text"
              className="form-control"
              style={{ width: "40%" }}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Street Address"
            />
            <input
              type="text"
              className="form-control"
              style={{ width: "20%" }}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
            <input
              type="text"
              className="form-control"
              style={{ width: "10%" }}
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
            />
            <InputMask
              mask="99999"
              className="form-control"
              style={{ width: "10%" }}
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="ZIP Code"
            />
          </div>
          <div className="row">
            <InputMask
              mask="999-999-9999"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
            />
            <input
              type="email"
              className="form-control"
              value={newEmail}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            />
          </div>
          {/* Password and Confirm Password Row */}
          <div className="row">
            <input
              type="password"
              className="form-control"
              style={{ width: "45%" }}
              value={newPassword}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <input
              type="password"
              className="form-control"
              style={{ width: "45%" }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
          </div>
          <div className="row">
            <label>
              <input
                type="checkbox"
                checked={isMember}
                onChange={(e) => setIsMember(e.target.checked)}
              />{" "}
              Register as Member
            </label>
          </div>
          <div className="row">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
            <Link to="/login">
              <button type="button" className="btn btn-cancel">
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegistrationPage;
