import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Friends.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function Friends() {
    const navigate = useNavigate();
    const [friendsList, setFriendsList] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        console.log("User:", user);
        console.log("Token:", token);

        if (user && token) {
            axios
                .get(`${process.env.REACT_APP_API_BASE_URL}/friends/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setFriendsList(response.data);
                })
                .catch((err) => {
                    console.error("Error fetching friends:", err.response?.data || err.message);
                    setError("Failed to fetch friends list. Please try again later.");
                });
        } else {
            setError("You must be logged in to view your friends.");
        }
    }, []);

    const handleNewFriend = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user || !token) {
            setError("You must be logged in to add friends.");
            return;
        }

        const friendUsername = prompt("Enter the username of the friend you want to add:");
        if (!friendUsername) return;

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/friend-requests/`,
                { friendUsername },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            alert(response.data.message || "Friend request sent!");
        } catch (err) {
            console.error("Error adding friend:", err.response?.data || err.message);
            setError("Failed to add friend. Please try again.");
        }
    };

    return (
        <div className="friends-page">
            <NavBar page="Friends" />
            <Button onClick={handleNewFriend}>Add Friend</Button>
            <div className="friends-container">
                <h2>My Friends</h2>
                {error && <p className="error">{error}</p>}
                <ul>
                    {friendsList.length > 0 ? (
                        friendsList.map((friend) => (
                            <li key={friend.id}>
                                <strong>{friend.username}</strong> -{" "}
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
