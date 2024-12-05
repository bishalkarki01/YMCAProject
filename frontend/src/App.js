

import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AdminDashboard from "./adminDashboard/adminDashboard";
import ListofUser from "./adminDashboard/ListofUser";
import HomePage from "./home/home";
import LoginPage from "./login/login";
import RegistrationPage from "./registration/registration";
import UserDashboard from "./userDashboard/userDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/usrs" element={<ListofUser />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
