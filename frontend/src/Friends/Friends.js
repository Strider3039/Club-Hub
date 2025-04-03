import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Friends.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";


function Friends() {
    const navigate = useNavigate();
    const [friendsList, setFriendsList] = useState([]); // List of friends
    const [error, setError] = useState(""); // Error message

    // Fetch the friend list when the page loads
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (user && token) {
            // Fetch the friend list from the backend
            axios
                .get("https://clubhub-backend-gmap.onrender.com/friends", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setFriendsList(response.data); // Set the friend list from the response
                })
                .catch((err) => {
                    setError("Failed to fetch friends list. Please try again later.");
                });
        }
        else
        {
            setError("You must be logged in to view your friends.");
        }
    }, []);

    // courtesy of chatgpt
    const handleNewFriend = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user || !token) {
            setError("You must be logged in to add friends.");
            return;
        }

        const friendUsername = prompt("Enter the username of the friend you want to add:");
        if (!friendUsername) return; // Cancel if the user doesn't enter anything

        try {
            const response = await axios.post(
                "https://clubhub-backend-gmap.onrender.com/friends/add",
                { friendUsername }, // Sending the username as the request body
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Assuming the response contains the updated list of friends
            setFriendsList(response.data);
        } catch (err) {
            setError("Failed to add friend. Please try again.");
        }
    };

    return (
        // complicate html list code
        <div className="friends-page">
            <NavBar page="Friends" />
            <Button onClick={(e) => handleNewFriend()} >Add Friend</Button>
            <div className="friends-container">
                <h2>My Friends</h2>
                {error && <p className="error">{error}</p>}
                <ul>
                    {friendsList.length > 0 ? (
                        friendsList.map((friend) => (
                            <li key={friend.id}>
                                <strong>{friend.name}</strong> -{" "}
                                {friend.clubs.length > 0
                                    ? friend.clubs.join(", ")
                                    : "No clubs"}
                            </li>
                        ))
                    ) : (
                        !error && <p>No friends found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Friends;
