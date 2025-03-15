import React from "react";
import NavBar from "../NavBar/NavBar";
import "./Friends.css";

function Friends() {
  const friendsList = [
    { id: 1, name: "Ethan Olsen", club: "Python Club" },
    { id: 2, name: "Connor Chase", club: "Frontend Club" },
    { id: 3, name: "Trevin Cloy", club: "C++ Club" }
  ];

  return (
    <div className="friends-page">
      <NavBar page="Friends" />
      <div className="friends-container">
        <h2>My Friends</h2>
        <ul>
          {friendsList.map(friend => (
            <li key={friend.id}>
              <strong>{friend.name}</strong> - {friend.club}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Friends;
