import React from "react";
import NavBar from "../NavBar/NavBar";
import "./Friends.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React { useState, useEffect} from "react";

function Friends() {

    // friend object
    const friend = {
      id: int,
      name: "",
      clubs: []
    }

    const navigate = useNavigate();
    // const [friends, setFriends] = React.useState([]); // this will contain a list of friend objects

    // this function is only called when the page initially loads
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user){
            // make sure the user is logged in, then continue fetching friends list
            const friends = JSON.parse(localStorage.getItem("friends"));


        }
        else
        {
            setError("you must be logged in to have friends lamo ┏ (゜ω゜)=👉");
        }
    }, []);




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
