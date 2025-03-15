import React, {useEffect, useState} from "react";
import NavBar from "../NavBar/NavBar";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    clubs: ["Clubs they will sign up too"],
    bio: "editable bio for everyone"
  });

  useEffect(() => {
    // Retrieve user details from localStorage (if stored after login/registration)
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
    } else {
      console.warn("No user data found in localStorage.");
    }
  }, []);

  return (
    <div className="dashboard">
      <NavBar page="Dashboard" />
      <div className="dashboard-container">
        <div className="profile-card">
          <h2>{user.firstName} {user.lastName}</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <h3>Clubs</h3>
          <ul>
            {user.clubs.map((club, index) => (
              <li key={index}>{club}</li>
            ))}
          </ul>
          <p className="bio">{user.bio}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
