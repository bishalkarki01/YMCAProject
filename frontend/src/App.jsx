/** @format */

import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import LoginPage from "./login/login";
import RegistrationPage from "./registration/registration";
import Homepage from "./homepage/homepage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/home" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

export default App;
