/**
 * Author : Bishal Karki // Isabella Breuhl 
 * Discription:Registration page of the application
 * Created : 13 November 2024
 * Last Modifies: 4  December 2024
 *
 * 
 */

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
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
      if (response.data.success) {
        setVerificationModal(true);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async () => {
    try {
      const response = await axios.post("http://localhost:5001/verify", {
        email: newEmail,
        code: verificationCode,
      });

      if (response.data.success) {
        alert("Email verified and registration complete.");
        setVerificationModal(false);
        navigate("/login");
      } else {
        setErrorMessage("Invalid verification code.");
      }
    } catch (error) {
      setErrorMessage("Verification failed. Please try again.");
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
              required
            />
            <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
            />
          </div>
          <div className="row">
            <input
              type="text"
              className="form-control"
              style={{ width: "40%" }}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Street Address"
              required
            />
            <input
              type="text"
              className="form-control"
              style={{ width: "20%" }}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              required
            />
            <input
              type="text"
              className="form-control"
              style={{ width: "10%" }}
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              required
            />
            <InputMask
              mask="99999"
              className="form-control"
              style={{ width: "10%" }}
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="ZIP Code"
              required
            />
          </div>
          <div className="row">
            <InputMask
              mask="999-999-9999"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              required
            />
            <input
              type="email"
              className="form-control"
              value={newEmail}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />
          </div>
          <div className="row">
            <input
              type="password"
              className="form-control"
              style={{ width: "45%" }}
              value={newPassword}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <input
              type="password"
              className="form-control"
              style={{ width: "45%" }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
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

      {/* Verification Modal */}
      {verificationModal && (
        <div className="verification-modal">
          <div className="verification-card">
            <h3>Verify Your Email</h3>
            <p>Enter the code sent to {newEmail}</p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Verification Code"
              required
            />
            <div className="row">
              <button onClick={handleVerifyCode} className="btn btn-verify">
                Verify
              </button>
              <button
                onClick={() => setVerificationModal(false)}
                className="btn btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistrationPage;
