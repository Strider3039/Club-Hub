import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Friends.css";
import axios from "axios";
import { Button } from "react-bootstrap";

function Friends() {
    const [friendsList, setFriendsList] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [friendsError, setFriendsError] = useState("");
    const [pendingError, setPendingError] = useState("");

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
                setFriendsError("Failed to load friends.");
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
                setPendingError("Failed to load pending requests.");
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
            setFriendsError("Failed to add friend.");
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_BASE_URL}/friend-requests/${requestId}/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            window.location.reload();
        } catch (err) {
            console.error("Error accepting request:", err.response?.data || err.message);
            setPendingError("Failed to accept friend request.");
        }
    };

    return (
        <div className="friends-page">
            <NavBar page="Friends" />
            <div className="container-fluid px-5 mt-4">
                <div className="row gx-4 gy-4">
                    {/* Left Column */}
                    <div className="col-lg-3">
                        <div className="section-card">
                            <h4>Pending Requests</h4>
                            {pendingError && <p className="text-danger">{pendingError}</p>}
                            <ul>
                                {pendingRequests.length > 0 ? (
                                    pendingRequests.map((req) => (
                                        <li key={req.id}>
                                            <span>{req.from_user.username}</span>
                                            <Button size="sm" onClick={() => handleAcceptRequest(req.id)}>Accept</Button>
                                        </li>
                                    ))
                                ) : (
                                    !pendingError && <p className="text-muted">No pending requests.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-lg-9">
                        <div className="section-card">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h3>My Friends</h3>
                                <Button onClick={handleNewFriend}>Add Friend</Button>
                            </div>
                            {friendsError && <p className="text-danger">{friendsError}</p>}
                            <ul>
                                {friendsList.length > 0 ? (
                                    friendsList.map((friend) => (
                                        <li key={friend.id}>
                                            <span>{friend.username}</span>
                                        </li>
                                    ))
                                ) : (
                                    !friendsError && <p className="text-muted">No friends found.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Friends;
