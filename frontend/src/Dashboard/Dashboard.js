import React from "react";
import NavBar from "../NavBar/NavBar";
import "./Dashboard.css";

function Dashboard() {
  // Dummy user data for now
  const userData = {
    name: "first and last name while registering",
    username: "username in database",
    email: "email while registering",
    clubs: ["Clubs they will sign up too"],
    bio: "editable bio for everyone"
  };

  return (
    <div className="dashboard-page">
      <NavBar page="Dashboard" />
      <div className="dashboard-container">
        <div className="profile-card">
          <h2>{userData.name}</h2>
          <p>@{userData.username}</p>
          <p>Email: {userData.email}</p>
          <h3>Clubs</h3>
          <ul>
            {userData.clubs.map((club, index) => (
              <li key={index}>{club}</li>
            ))}
          </ul>
          <p className="bio">{userData.bio}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
