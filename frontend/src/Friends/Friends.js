import React, { useEffect, useState } from "react";
import "./Friends.css";
import authAxios from "../utils/authAxios";
import { Button, Modal, Row, Col } from "react-bootstrap";
import GenLayout from "../Layout/GeneralLayout";
import Form from "react-bootstrap/Form";

function Friends() {
    const [friendsList, setFriendsList] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [friendsError, setFriendsError] = useState("");
    const [pendingError, setPendingError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [friendUsername, setFriendUsername] = useState("");

    const fetchFriends = async () => {
        try {
            const response = await authAxios.get("/friends/");
            setFriendsList(response.data);
        } catch (err) {
            setFriendsError("Failed to load friends.");
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const response = await authAxios.get("/friend-requests/pending/");
            setPendingRequests(response.data);
        } catch (err) {
            setPendingError("Failed to load pending requests.");
        }
    };

    useEffect(() => {
        fetchFriends();
        fetchPendingRequests();
    }, []);

    const handleNewFriend = async () => {
        if (!friendUsername) return;
        try {
            await authAxios.post("/friend-requests/", { friendUsername });
            alert("Friend request sent!");
            setFriendUsername("");
            setShowForm(false);
        } catch (err) {
            setFriendsError("Failed to add friend.");
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await authAxios.patch(`/friend-requests/${requestId}/`, {});
            fetchFriends();
            fetchPendingRequests();
        } catch (err) {
            setPendingError("Failed to accept friend request.");
        }
    };

    const handleViewFriend = async (friendId) => {
        try {
            const response = await authAxios.get(`/friends/${friendId}/`);
            setSelectedFriend(response.data);
            setShowModal(true);
        } catch (err) {
            console.error("Error loading friend details");
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
            alert("Failed to remove friend.");
        }
    };

    return (
        <GenLayout pageTitle="Friends">
            <div className="page-wrapper">
                <div className="page-header">
                    <div>
                        <h2>Friends</h2>
                        <p className="page-header-subtitle">Manage your connections and friend requests.</p>
                    </div>
                    <Button variant="danger" onClick={() => setShowForm(true)}>
                        + Add Friend
                    </Button>
                </div>

                <Row className="g-4">
                    {/* Pending Requests */}
                    <Col xs={12} lg={4}>
                        <div className="app-card">
                            <div className="app-card-header">
                                <h6 className="app-card-title">Pending Requests</h6>
                                <span className="friends-badge">{pendingRequests.length}</span>
                            </div>
                            {pendingError && <p className="text-danger small">{pendingError}</p>}
                            {pendingRequests.length > 0 ? (
                                <ul className="friends-list">
                                    {pendingRequests.map((req) => (
                                        <li key={req.id} className="friends-item">
                                            <div className="friends-item-info">
                                                <div className="friends-avatar">
                                                    {req.from_user.username[0].toUpperCase()}
                                                </div>
                                                <span className="friends-name">{req.from_user.username}</span>
                                            </div>
                                            <Button size="sm" variant="danger" onClick={() => handleAcceptRequest(req.id)}>
                                                Accept
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                !pendingError && (
                                    <div className="friends-empty">
                                        <p className="text-muted mb-0">No pending requests.</p>
                                    </div>
                                )
                            )}
                        </div>
                    </Col>

                    {/* Friends List */}
                    <Col xs={12} lg={8}>
                        <div className="app-card">
                            <div className="app-card-header">
                                <h6 className="app-card-title">My Friends</h6>
                                <span className="friends-badge">{friendsList.length}</span>
                            </div>
                            {friendsError && <p className="text-danger small">{friendsError}</p>}
                            {friendsList.length > 0 ? (
                                <ul className="friends-list">
                                    {friendsList.map((friend) => (
                                        <li key={friend.id} className="friends-item">
                                            <div className="friends-item-info">
                                                <div className="friends-avatar">
                                                    {friend.username[0].toUpperCase()}
                                                </div>
                                                <span className="friends-name">{friend.username}</span>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <Button size="sm" variant="outline-secondary" onClick={() => handleViewFriend(friend.id)}>
                                                    View
                                                </Button>
                                                <Button size="sm" variant="outline-danger" onClick={() => handleUnfriend(friend.id)}>
                                                    Unfriend
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                !friendsError && (
                                    <div className="friends-empty">
                                        <p className="text-muted mb-2">You haven't added any friends yet.</p>
                                        <Button variant="danger" onClick={() => setShowForm(true)}>
                                            Send your first request
                                        </Button>
                                    </div>
                                )
                            )}
                        </div>
                    </Col>
                </Row>
            </div>

            {/* View Friend Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Friend Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedFriend ? (
                        <div className="friend-detail-list">
                            <div className="friend-detail-row">
                                <span className="friend-detail-label">Username</span>
                                <span className="friend-detail-value">{selectedFriend.username}</span>
                            </div>
                            <div className="friend-detail-row">
                                <span className="friend-detail-label">First Name</span>
                                <span className="friend-detail-value">{selectedFriend.first_name}</span>
                            </div>
                            <div className="friend-detail-row">
                                <span className="friend-detail-label">Last Name</span>
                                <span className="friend-detail-value">{selectedFriend.last_name}</span>
                            </div>
                            <div className="friend-detail-row">
                                <span className="friend-detail-label">Email</span>
                                <span className="friend-detail-value">{selectedFriend.email}</span>
                            </div>
                            <div className="friend-detail-row">
                                <span className="friend-detail-label">Clubs</span>
                                <span className="friend-detail-value">
                                    {selectedFriend.clubs.length > 0 ? selectedFriend.clubs.join(", ") : "No clubs"}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => handleUnfriend(selectedFriend.id)}>
                        Unfriend
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Add Friend Modal */}
            <Modal show={showForm} onHide={() => setShowForm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add a Friend</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username..."
                                value={friendUsername}
                                onChange={(e) => setFriendUsername(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNewFriend()}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleNewFriend}>Send Request</Button>
                </Modal.Footer>
            </Modal>
        </GenLayout>
    );
}

export default Friends;
