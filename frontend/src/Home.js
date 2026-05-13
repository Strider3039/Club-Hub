import React, { useState, useEffect } from "react";
import GenLayout from "./Layout/GeneralLayout";
import authAxios from "./utils/authAxios";
import { useNavigate } from "react-router-dom";
import { Badge, Spinner, Row, Col } from "react-bootstrap";
import "./Home.css";

function Home() {
    const navigate = useNavigate();
    const [myClubs, setMyClubs] = useState([]);
    const [friends, setFriends] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [clubsRes, friendsRes, pendingRes] = await Promise.allSettled([
                    authAxios.get("/clubs/list/"),
                    authAxios.get("/friends/"),
                    authAxios.get("/friend-requests/pending/"),
                ]);

                if (clubsRes.status === "fulfilled") {
                    setMyClubs(clubsRes.value.data.filter(c => c.is_member));
                }
                if (friendsRes.status === "fulfilled") {
                    setFriends(friendsRes.value.data);
                }
                if (pendingRes.status === "fulfilled") {
                    setPendingCount(pendingRes.value.data.length);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    return (
        <GenLayout pageTitle="Home">
            <div className="page-wrapper">
                <div className="page-header">
                    <div>
                        <h2>Welcome back, {user.first_name || user.username}</h2>
                        <p className="page-header-subtitle">Here's what's happening in your clubs and community.</p>
                    </div>
                </div>

                <Row className="g-4">
                    {/* Left column — Profile + Quick links */}
                    <Col xs={12} lg={3}>
                        <div className="home-profile-card mb-4">
                            <div className="home-avatar">
                                {user.username ? user.username[0].toUpperCase() : "?"}
                            </div>
                            <h5 className="mb-1">{user.first_name} {user.last_name}</h5>
                            <p className="text-muted mb-3">@{user.username}</p>
                            <div className="home-stats">
                                <div className="home-stat">
                                    <span className="home-stat-num">{myClubs.length}</span>
                                    <span className="home-stat-label">Clubs</span>
                                </div>
                                <div className="home-stat-divider" />
                                <div className="home-stat">
                                    <span className="home-stat-num">{friends.length}</span>
                                    <span className="home-stat-label">Friends</span>
                                </div>
                            </div>
                        </div>

                        <div className="app-card">
                            <div className="app-card-header">
                                <h6 className="app-card-title">Quick Links</h6>
                            </div>
                            <button className="home-quick-btn" onClick={() => navigate("/clubs")}>Browse Clubs</button>
                            <button className="home-quick-btn" onClick={() => navigate("/friends")}>My Friends</button>
                            <button className="home-quick-btn" onClick={() => navigate("/clubRegister")}>Create a Club</button>
                            <button className="home-quick-btn" onClick={() => navigate("/dashboard")}>My Profile</button>
                        </div>
                    </Col>

                    {/* Middle column — My Clubs */}
                    <Col xs={12} lg={6}>
                        <div className="app-card">
                            <div className="app-card-header">
                                <h6 className="app-card-title">My Clubs</h6>
                                <button className="home-action-btn-sm" onClick={() => navigate("/clubs")}>
                                    Browse All
                                </button>
                            </div>

                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="danger" />
                                </div>
                            ) : myClubs.length === 0 ? (
                                <div className="home-empty-state">
                                    <div className="home-empty-icon">🎯</div>
                                    <p className="fw-semibold">No clubs yet</p>
                                    <p className="text-muted small">Join a club to see it here.</p>
                                    <button className="home-action-btn mt-2" onClick={() => navigate("/clubs")}>
                                        Discover Clubs
                                    </button>
                                </div>
                            ) : (
                                <div className="home-clubs-grid">
                                    {myClubs.map(club => (
                                        <div
                                            key={club.id}
                                            className="home-club-card"
                                            onClick={() => navigate(`/clubHome/${club.id}`)}
                                        >
                                            <div className="home-club-avatar">{club.name[0]}</div>
                                            <div className="home-club-info">
                                                <h6 className="mb-0">{club.name}</h6>
                                                <p className="text-muted small mb-0 home-club-desc">
                                                    {club.description || "No description"}
                                                </p>
                                            </div>
                                            <span className="home-club-arrow">›</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Col>

                    {/* Right column — Friends */}
                    <Col xs={12} lg={3}>
                        <div className="app-card">
                            <div className="app-card-header">
                                <h6 className="app-card-title">Friends</h6>
                                {pendingCount > 0 && (
                                    <Badge
                                        bg="danger"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigate("/friends")}
                                    >
                                        {pendingCount} pending
                                    </Badge>
                                )}
                            </div>

                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="danger" />
                                </div>
                            ) : friends.length === 0 ? (
                                <div className="home-empty-state">
                                    <div className="home-empty-icon">👋</div>
                                    <p className="fw-semibold">No friends yet</p>
                                    <p className="text-muted small">Send a friend request to get started.</p>
                                    <button className="home-action-btn mt-2" onClick={() => navigate("/friends")}>
                                        Find Friends
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <ul className="home-friends-list">
                                        {friends.slice(0, 8).map(friend => (
                                            <li key={friend.id} className="home-friend-item">
                                                <div className="home-friend-avatar">
                                                    {friend.username[0].toUpperCase()}
                                                </div>
                                                <span className="home-friend-name">{friend.username}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {friends.length > 8 && (
                                        <p className="text-muted small text-center mt-2 mb-0">
                                            +{friends.length - 8} more
                                        </p>
                                    )}
                                </>
                            )}

                            <button className="home-action-btn mt-3 w-100" onClick={() => navigate("/friends")}>
                                Manage Friends
                            </button>
                        </div>
                    </Col>
                </Row>
            </div>
        </GenLayout>
    );
}

export default Home;
