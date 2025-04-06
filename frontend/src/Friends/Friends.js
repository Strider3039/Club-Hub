import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Friends.css";
import authAxios from "../utils/authAxios"; // ✅ Custom axios with token refresh
import { Button, Modal } from "react-bootstrap";

function Friends() {
    const [friendsList, setFriendsList] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [friendsError, setFriendsError] = useState("");
    const [pendingError, setPendingError] = useState("");

    const fetchFriends = async () => {
        try {
            const response = await authAxios.get("/friends/");
            setFriendsList(response.data);
        } catch (err) {
            console.error("Error fetching friends:", err.response?.data || err.message);
            setFriendsError("Failed to load friends.");
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const response = await authAxios.get("/friend-requests/pending/");
            setPendingRequests(response.data);
        } catch (err) {
            console.error("Error fetching pending requests:", err.response?.data || err.message);
            setPendingError("Failed to load pending requests.");
        }
    };

    useEffect(() => {
        fetchFriends();
        fetchPendingRequests();
    }, []);

    const handleNewFriend = async () => {
        const friendUsername = prompt("Enter the username of the friend you want to add:");
        if (!friendUsername) return;

        try {
            await authAxios.post("/friend-requests/", { friendUsername });
            alert("Friend request sent!");
        } catch (err) {
            console.error("Error adding friend:", err.response?.data || err.message);
            setFriendsError("Failed to add friend.");
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await authAxios.patch(`/friend-requests/${requestId}/`, {});
            fetchFriends();
            fetchPendingRequests();
        } catch (err) {
            console.error("Error accepting request:", err.response?.data || err.message);
            setPendingError("Failed to accept friend request.");
        }
    };

    const handleViewFriend = async (friendId) => {
        try {
            const response = await authAxios.get(`/friends/${friendId}/`);
            setSelectedFriend(response.data);
            setShowModal(true);
        } catch (err) {
            console.error("Error loading friend details:", err.response?.data || err.message);
        }
    };

    const handleUnfriend = async (friendId) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this friend?");
        if (!confirmDelete) return;

        try {
            await authAxios.delete(`/friends/${friendId}/`);
            fetchFriends();
            setShowModal(false);
        } catch (err) {
            console.error("Error removing friend:", err.response?.data || err.message);
            alert("Failed to remove friend.");
        }
    };

    return (
        <div className="friends-page">
            <NavBar page="Friends" />
            <div className="container-fluid px-5 mt-4">
                <div className="row gx-4 gy-4">
                    {/* Pending Requests */}
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

                    {/* Friends List */}
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
                                            <div className="d-flex gap-2">
                                                <Button size="sm" variant="info" onClick={() => handleViewFriend(friend.id)}>View</Button>
                                                <Button size="sm" variant="danger" onClick={() => handleUnfriend(friend.id)}>Unfriend</Button>
                                            </div>
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

            {/* View Friend Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Friend Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedFriend ? (
                        <div>
                            <p><strong>Username:</strong> {selectedFriend.username}</p>
                            <p><strong>First Name:</strong> {selectedFriend.first_name}</p>
                            <p><strong>Last Name:</strong> {selectedFriend.last_name}</p>
                            <p><strong>Email:</strong> {selectedFriend.email}</p>
                            <p><strong>Clubs:</strong> {selectedFriend.clubs.length > 0 ? selectedFriend.clubs.join(", ") : "No clubs"}</p>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleUnfriend(selectedFriend.id)}>Unfriend</Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Friends;
