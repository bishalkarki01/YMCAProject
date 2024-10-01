/** @format */

import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./login.css";

// Member, Staff and AMDIN login page

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Declare the useNavigate hook

  const emailLogin = (event) => {
    setEmail(event.target.value);
  };

  const passwordLogin = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5001/login", {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/home"); // Use navigate to programmatically redirect to /home
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="loginPage">
      <div className="left">
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
    </div>
  );
}

export default LoginPage;
