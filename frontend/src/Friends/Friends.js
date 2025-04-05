import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Friends.css";
import axios from "axios";
import { Button } from "react-bootstrap";

function Friends() {
    const [friendsList, setFriendsList] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/friends/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFriendsList(response.data);
            } catch (err) {
                console.error("Error fetching friends:", err.response?.data || err.message);
                setError("Failed to fetch friends list.");
            }
        };

        const fetchPendingRequests = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/friend-requests/pending/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPendingRequests(response.data);
            } catch (err) {
                console.error("Error fetching pending requests:", err.response?.data || err.message);
                setError("Failed to fetch pending requests.");
            }
        };

        if (token) {
            fetchFriends();
            fetchPendingRequests();
        }
    }, [token]);

    const handleNewFriend = async () => {
        const friendUsername = prompt("Enter the username of the friend you want to add:");
        if (!friendUsername) return;

        try {
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/friend-requests/`,
                { friendUsername },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            alert("Friend request sent!");
        } catch (err) {
            console.error("Error adding friend:", err.response?.data || err.message);
            setError("Failed to add friend.");
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_BASE_URL}/friend-requests/${requestId}/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh lists after accepting
            window.location.reload();
        } catch (err) {
            console.error("Error accepting request:", err.response?.data || err.message);
            setError("Failed to accept friend request.");
        }
    };

    return (
        <div className="container friends-page">
            <NavBar page="Friends" />

            <div className="friends-header">
                <h2>Friends</h2>
                <Button className="add-friend-btn" onClick={handleNewFriend}>Add Friend</Button>
            </div>

            <div className="row friends-layout">
                {/* Pending Requests */}
                <div className="col-md-4 section-card">
                    <h3>Pending Requests</h3>
                    <ul>
                        {pendingRequests.length > 0 ? (
                            pendingRequests.map((req) => (
                                <li key={req.id}>
                                    <span>{req.from_user.username}</span>
                                    <Button size="sm" onClick={() => handleAcceptRequest(req.id)}>Accept</Button>
                                </li>
                            ))
                        ) : (
                            <p>No pending requests.</p>
                        )}
                    </ul>
                </div>

                {/* Friends List */}
                <div className="col-md-6 section-card">
                    <h3>My Friends</h3>
                    {error && <p className="text-danger">{error}</p>}
                    <ul>
                        {friendsList.length > 0 ? (
                            friendsList.map((friend) => (
                                <li key={friend.id}>
                                    <span>{friend.username}</span>
                                </li>
                            ))
                        ) : (
                            !error && <p>No friends found.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Friends;
