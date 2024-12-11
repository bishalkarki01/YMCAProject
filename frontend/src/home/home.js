/**
 * Author : Bishal Karki // Isabella Breuhl // Kaaviya Saraboji
 * Discription:Home page of the applicatin 
 * Created : 13 November 2024
 * Last Modifies: 4  December 2024
 *
 * 
 */
import axios from "axios";
import React, { useEffect, useState } from "react";
import banner from "./banner.png";
import cycle from "./cycle.png";
import "./home.css";
import logo from "./logo.jpg";
import photo1 from "./photo1.png";
import photo2 from "./photo2.png";
import photo3 from "./photo3.png";
import userguide from "./userguide.png";
import defaultImage from "./YMCA.png";
import yoga from "./yoga.jpeg";

const HomePage = () => {
  const [programs, setPrograms] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const overlay = popupVisible ? { opacity: "30%" } : {};

  const togglePopUp = () => {
    setPopupVisible(!popupVisible);
  };

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
        <div className="top-bar" style={overlay}>
          <div className="top-info">
            <span className="phone">
              <i className="fas fa-phone"></i> (608) - 570 - 4191
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
        <nav className="main-nav" style={overlay}>
          <div className="logo">
            <img src={logo} alt="YMCA Logo" className="logo-image" />
          </div>
          <ul className="nav-list">
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="#program-section">Programs</a>
            </li>
            <li>
              <a href="#memberships">Membership</a>
            </li>
            <li>
              <a href="#about-section">About Us</a>
            </li>
          </ul>
          <div className="contact-button" onClick={togglePopUp}>
            Contact Us
          </div>
        </nav>
      </header>

      {/* Pop Up section here: if contact-button is clicked */}
      {popupVisible && (
        <div className="popup">
          <div className="popupInfo">
            <div className="close" onClick={togglePopUp}>
              <b>x</b>
            </div>
            <h3 className="popup-title">How can we help?</h3>
          </div>
          <div>Get in touch with YMCA through one of the methods below.</div>
          <div className="contact-support">
            <div className="support">
              <i className="fas fa-phone"></i> <b> (608) - 570 - 4191</b>
            </div>
            <div className="support">
              <i className="fas fa-envelope"></i>
              <b> info@ymca.com</b>
            </div>
            <div className="support">
              <a
                href="https://www.facebook.com/YMCA/"
                style={{ color: "white" }}>
                <i className="fab fa-facebook" style={{ color: "white" }}></i>{" "}
                <b>Facebook</b>{" "}
              </a>
            </div>
            <div className="support">
              <a
                href="https://www.instagram.com/ymca/?hl=en"
                style={{ color: "white" }}>
                <i className="fab fa-instagram" style={{ color: "white" }}></i>{" "}
                <b>Instagram</b>{" "}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={overlay}>
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
              Learn from certified instructors in a safe and fun environment.
              Sign up now and make a splash!
            </p>
            <a href="/login" className="btn-primary">
              Enroll Now
            </a>
          </div>
        </section>
      </section>

      {/* Section to Display Programs */}
      <section
        className="info-cards"
        section
        id="program-section"
        style={overlay}>
        <h2 className="section-heading">Our Programs</h2>
        <p className="section-subheading">
          Check out our latest programs offered in your area
        </p>
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
                  <strong>Time:</strong> {program.startTime}
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


        {/* Section to Display User Mannual  */}
        <section style={overlay}>
        <section
          className="membership-header"
          section
          id="memberships"
          style={{
            backgroundImage: `url(${userguide})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "250px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom:"10px"
          }}>
      <div className="hero-content">
  <h1>Need Help?</h1>
  <p>You can download our user manual here</p>
  <a 
    href="./UserManual.pdf" 
    className="btn-primary" 
    download="User_Manual.pdf"
  >
    Download
  </a>
</div>

        </section>
      </section>

      {/* Section to Display Membership Info */}
      <section style={overlay}>
        <section
          className="membership-header"
          section
          id="memberships"
          style={{
            backgroundImage: `url(${yoga})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "250px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <div className="hero-content">
            <h1>Membership Benefits</h1>
            <p>Healthy starts here</p>
            <a href="/register" className="btn-primary">
              Register Now
            </a>
          </div>
        </section>
        <section className="membership-body" style={overlay}>
          <ul className="benefits-list">
            <li> 24/7 Access </li>
            <li> Unlimited fitness classes </li>
            <li> Access to multiple locations </li>
            <li> Early Program Registration </li>
            <li> Free 2 hour childcare on weekdays </li>
            <li> Modern fitness center </li>
            <li> Lap pool </li>
            <li> Kids pool and waterslide </li>
            <li>
              {" "}
              Free <i>KidZone Play Space</i> use
            </li>
            <li> Access to monthly special classes</li>
            <li> Running track </li>
            <li> Racquetball courts </li>
            <li> Indoor/Outdoor Basketball courts </li>
            <li> Tennis courts </li>
            <li> Private yoga studios </li>
          </ul>
        </section>
      </section>

      {/* About Us Section */}
      <section className="about" section id="about-section" style={overlay}>
        <h2 className="section-heading">About Us</h2>
        <p className="section-subheading">
          <b>
            The YMCA focuses on strengthening the foundations of our community
            through youth development, healthy living, and social
            responsibility.
          </b>
        </p>
        <div className="about-body">
          <div
            className="photo1"
            style={{
              backgroundImage: `url(${cycle})`,
              backgroundSize: "cover",
              backgroundPosition: "top",
              height: "350px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}></div>
          <div className="values">
            <h2 className="values-title">Our Values</h2>
          </div>
        </div>
      </section>
      <section className="values-words" style={overlay}>
        <ul className="values-list">
          <li className="value1">Caring</li>
          <li className="value2">Honesty</li>
          <li className="value3">Respect</li>
          <li className="value4">Responsibility</li>
        </ul>
      </section>
      <section className="mission" style={overlay}>
        <h2 className="section-heading">Our Mission</h2>
        <p className="section-subheading">
          <b>
            The La Crosse Area Family Y is a non-profit organization dedicated
            to enriching our community by promoting physical, mental, and
            spiritual well-being for all. Every day and in everything we do, we
            strive to create a culture that is welcoming, genuine, hopeful,
            nurturing, and determined for all our staff, members, program
            participants, and volunteers. The La Crosse Area Family Y values
            individuals from diverse backgrounds working together to strengthen
            our community. Our core values of caring, honesty, respect, and
            responsibility guide us as we embrace diversity, equity, and
            inclusion. We strive to build an atmosphere where everyone feels
            welcomed, valued, and respected, and where we all have the
            opportunity to reach our full potential.
          </b>
        </p>
      </section>
      <section className="culture" style={overlay}>
        <h2 className="culture-title">Our Impact</h2>
      </section>
      <section style={overlay}>
        <p className="culture-body">
          <b>
            Annually, we provide services to almost 8,000 youth in swim lessons,
            gymnastics, childcare, dance, inclusion programs, music, sports,
            martial arts, and more. On average, we serve nearly 200,000 meals
            and snacks annually to help fight hunger and fuel futures. We
            provide more than $1 million in direct financial assistance
            annually, allowing nearly 25% of our members to participate at the
            Y.
          </b>
        </p>
        <div
          className="photo2"
          style={{
            backgroundImage: `url(${photo3})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}></div>
        <div
          className="photo3"
          style={{
            backgroundImage: `url(${photo1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}></div>
        <div
          className="photo4"
          style={{
            backgroundImage: `url(${photo2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}></div>
      </section>

      {/* Footer Section */}
      <footer className="footer" style={overlay}>
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
              <i className="fas fa-phone"></i> (608) - 570 - 4191
            </p>
            <p>
              <i className="fas fa-envelope"></i> info@ymca.com
            </p>
          </div>
          <div className="footer-social">
            <h3>Follow Us</h3>
            <p>
              <a href="https://www.facebook.com/YMCA/">
                <i className="fab fa-facebook"></i> Facebook
              </a>
            </p>
            <p>
              <a href="https://www.instagram.com/ymca/?hl=en">
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
