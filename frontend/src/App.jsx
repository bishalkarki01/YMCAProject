/** @format */

import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import LoginPage from "./login/login";
import RegistrationPage from "./registration/registration";
// Where all the webpages go for the router-dom

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
