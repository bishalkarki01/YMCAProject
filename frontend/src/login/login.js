/**
 * Author : Bishal Karki // Isabella Breuhl 
 * Discription:Login Page of the application
 * Created : 13 November 2024
 * Last Modifies: 13  November 2024
 *
 * 
 */

import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationModal, setVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  const emailLogin = (event) => setEmail(event.target.value);
  const passwordLogin = (event) => setPassword(event.target.value);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5001/login", {
        email,
        password,
      });

      if (response.data.token) {
        // Save user details and token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("isMember", response.data.isMember);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("firstName", response.data.firstName);

        // Navigate based on the role
        if (response.data.role === "admin") {
          navigate("/adminDashboard");
        } else if (response.data.role === "participant") {
          navigate("/userDashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // User found in TemporaryUser - open the verification modal
        setVerificationModal(true);
        setErrorMessage(
          "Email not verified. A verification code has been sent to your email."
        );
      } else {
        setErrorMessage(error.response?.data?.message || "Login failed");
      }
    }
  };

  // Handler for verifying the code entered in the modal
  const handleVerifyCode = async () => {
    try {
      const response = await axios.post("http://localhost:5001/verify", {
        email,
        code: verificationCode,
      });

      if (response.data.success) {
        alert("Email verified and registration complete.");
        setVerificationModal(false);
        setErrorMessage("");
        await handleLogin();
      } else {
        setErrorMessage("Invalid verification code.");
      }
    } catch (error) {
      setErrorMessage("Verification failed. Please try again.");
    }
  };

  return (
    <div className="loginPage">
      <div className="left">
        <Link to="/home">
          <button className="back-button">
            <b>Back to Homepage</b>
          </button>
        </Link>
        <h1 className="title">Welcome!</h1>
        <h3 className="subtitle">LOGIN TO YOUR ACCOUNT</h3>
        <div className="textbox">
          <input
            type="text"
            id="email"
            value={email}
            onChange={emailLogin}
            placeholder="Email Address"
          />
        </div>
        <div className="textbox">
          <input
            type="password"
            id="password"
            value={password}
            onChange={passwordLogin}
            placeholder="Password"
          />
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button onClick={handleLogin} className="btn-login">
          <b>Login</b>
        </button>
      </div>

      <div className="right">
        <h1 className="newHere">New Here?</h1>
        <h3 className="instructions">Sign up to start your journey</h3>
        <Link to="/register">
          <button className="btn-register">
            <b>Sign Up</b>
          </button>
        </Link>
      </div>

      {/* Verification Modal */}
      {verificationModal && (
        <div className="verification-modal">
          <div className="verification-card">
            <h3>Verify Your Email</h3>
            <p>Enter the code sent to {email}</p>
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

export default LoginPage;
