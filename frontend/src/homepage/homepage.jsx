import React from "react";
import { ProgramCard } from "../components/program-card";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import "./homepage.css";

const Homepage = () => {
  const programs = [
    {
      id: 1,
      name: "Programs",
      description: "Grab the opportunity to participate in our programs and enjoy them",
      image: "https://picsum.photos/300/500",
      url: "https://google.com",
    },
    {
      id: 2,
      name: "Memberships",
      description: "Join the membership and avail all programs in special offers",
      image: "https://picsum.photos/300/500",
      url: "https://google.com",
    },
    {
      id: 3,
      name: "Events",
      description: "Multiple events to excite you to participate in.",
      image: "https://picsum.photos/300/500",
      url: "https://google.com",
    },
    {
      id: 4,
      name: "Group-sessions",
      description: "Join our group sessions to learn with fun",
      image: "https://picsum.photos/300/500",
      url: "https://google.com",
    }
  ];

  return (
    <>
      <Navbar />
      <div className="programs-container">
        <h1>A place for all to belong!</h1>
        
         <h4>YMCA is more than a place to exercise; it’s a community that empowers individuals to grow, connect, and thrive together. We believe that everyone deserves the opportunity to lead a healthy and fulfilling life.</h4>
        <br>
        </br>
        <br>
        </br>
        <div className="programs-grid">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              name={program.name}
              desc={program.description}
              image={program.image}
              url={program.url}
            />
          ))}
        </div>
        <br>
        </br>
        
        <h3>Welcome to the best "Third Place!" Your first place is home, your second place is typically work, and your third place is where you go to socialize and build friendships.</h3>
            
            <h4> We believe our Y is the best third place in our region, bringing together friends and neighbors, building relationships, and connecting people from diverse backgrounds for engagement and combating the epidemic of loneliness.

At the YMCA, we are dedicated to being that third place for you—a place where you can connect, grow, and thrive. From group exercise classes, family programming, and sports leagues to community events and volunteer opportunities, we provide numerous ways for you to engage and build meaningful relationships.
</h4>

<br></br>
<br></br>
<br></br>
        <Footer />
      </div>
    </>
  );
};

export default Homepage;
