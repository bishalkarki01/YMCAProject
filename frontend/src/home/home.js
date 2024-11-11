/** @format */

import axios from "axios";
import React, { useEffect, useState } from "react";
import banner from "./banner.png";
import "./home.css";
import logo from "./logo.jpg";
import defaultImage from "./YMCA.png";

const HomePage = () => {
  const [programs, setPrograms] = useState([]);

  // Fetch programs from the backend API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/program/prgramlists"
        );
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <>
      <header>
        {}
        <div className="top-bar">
          <div className="top-info">
            <span className="phone">
              <i className="fas fa-phone"></i> 608 - 5704191 / 5604191
            </span>
            <span className="email">
              <i className="fas fa-envelope"></i> info@ymca.com
            </span>
          </div>
          <div className="apply-now">
            <a href="/login" className="apply-link">
              <i className="fas fa-user"></i>
            </a>
          </div>
        </div>

        {/* Main  Navigation */}
        <nav className="main-nav">
          <div className="logo">
            <img src={logo} alt="YMCA Logo" className="logo-image" />
          </div>
          <ul className="nav-list">
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="#program-section">Program</a>
            </li>
            <li>
              <a href="#">Membership</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
          <div className="contact-button">
            <a href="/login" className="contact-link">
              Contact Us
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "600px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <div className="hero-content">
          <h1>Join Our Exciting Swimming Classes Today!</h1>
          <p>
            Learn from certified instructors in a safe and fun environment. Sign
            up now and make a splash!
          </p>
          <a href="/login" className="btn-primary">
            Enroll Now
          </a>
        </div>
      </section>

      {/* Section to Display Programs */}
      <section className="info-cards" section id="program-section">
        <h2 className="section-heading">Our Programs</h2>
        <p className="section-subheading">Check out our latest programs</p>
        <div className="card-container">
          {programs.map((program) => (
            <div className="card" key={program._id}>
              <img
                src={program.image ? program.image : defaultImage}
                alt={program.programName}
                className="card-image"
              />
              <div className="card-content">
                <h3>{program.programName}</h3>
                <p>{program.description}</p>
                <p>
                  <strong>Dates:</strong> {program.startDate} -{" "}
                  {program.endDate}
                </p>
                <p>
                  <strong>Start Time:</strong> {program.startTime}
                </p>
                <p>
                  <strong>Location:</strong> {program.location}
                </p>
                <p>
                  <strong>Max Participants:</strong> {program.participants}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* {}
        <div className="register-now">
          <a href="/contact" className="btn-primary register-btn">
            Register Now
          </a>
        </div> */}
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-about">
            <h3>About YMCA</h3>
            <p>
              The YMCA is dedicated to improving the health and well-being of
              our members, residents, and the surrounding community.
            </p>
          </div>
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>
              <i className="fas fa-phone"></i> 608 - 5704191 / 5604191
            </p>
            <p>
              <i className="fas fa-envelope"></i> info@ymca.com
            </p>
          </div>
          <div className="footer-social">
            <h3>Follow Us</h3>
            <p>
              <a href="#">
                <i className="fab fa-facebook"></i> Facebook
              </a>
            </p>
            <p>
              <a href="#">
                <i className="fab fa-instagram"></i> Instagram
              </a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 YMCA. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
