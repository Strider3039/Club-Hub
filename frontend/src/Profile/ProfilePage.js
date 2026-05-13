import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import GenLayout from '../Layout/GeneralLayout';
import authAxios from '../utils/authAxios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

function ProfilePage() {
    const [myClubs, setMyClubs] = useState([]);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clubsRes, friendsRes] = await Promise.allSettled([
                    authAxios.get("/clubs/list/"),
                    authAxios.get("/friends/"),
                ]);
                if (clubsRes.status === "fulfilled") {
                    setMyClubs(clubsRes.value.data.filter(c => c.is_member));
                }
                if (friendsRes.status === "fulfilled") {
                    setFriends(friendsRes.value.data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <GenLayout pageTitle="My Profile">
            <div className="page-wrapper">
                <div className="page-header">
                    <div>
                        <h2>My Profile</h2>
                        <p className="page-header-subtitle">View your account and the clubs you're part of.</p>
                    </div>
                </div>

                <Row className="g-4">
                    {/* Profile info card */}
                    <Col xs={12} md={4} lg={3}>
                        <div className="profile-info-card">
                            <div className="profile-avatar-large">
                                {user.username ? user.username[0].toUpperCase() : "?"}
                            </div>
                            <h4 className="mb-1">{user.first_name} {user.last_name}</h4>
                            <p className="text-muted mb-3">@{user.username}</p>

                            <div className="profile-details">
                                <div className="profile-detail-row">
                                    <span className="profile-detail-label">Email</span>
                                    <span className="profile-detail-value">{user.email || "—"}</span>
                                </div>
                                {user.date_of_birth && (
                                    <div className="profile-detail-row">
                                        <span className="profile-detail-label">Birthday</span>
                                        <span className="profile-detail-value">{user.date_of_birth}</span>
                                    </div>
                                )}
                            </div>

                            <div className="profile-stats">
                                <div className="profile-stat">
                                    <span className="profile-stat-num">{myClubs.length}</span>
                                    <span className="profile-stat-label">Clubs</span>
                                </div>
                                <div className="profile-stat-divider" />
                                <div className="profile-stat">
                                    <span className="profile-stat-num">{friends.length}</span>
                                    <span className="profile-stat-label">Friends</span>
                                </div>
                            </div>

                            <div className="d-grid gap-2 mt-3">
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => navigate("/settings")}
                                >
                                    Account Settings
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => navigate("/friends")}
                                >
                                    My Friends
                                </Button>
                            </div>
                        </div>
                    </Col>

                    {/* Clubs list */}
                    <Col xs={12} md={8} lg={9}>
                        <div className="app-card">
                            <div className="app-card-header">
                                <h6 className="app-card-title">My Clubs</h6>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => navigate("/clubs")}
                                >
                                    Browse All Clubs
                                </Button>
                            </div>

                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="danger" />
                                </div>
                            ) : myClubs.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted mb-3">You haven't joined any clubs yet.</p>
                                    <Button variant="danger" onClick={() => navigate("/clubs")}>
                                        Find Clubs
                                    </Button>
                                </div>
                            ) : (
                                <div className="profile-clubs-grid">
                                    {myClubs.map(club => (
                                        <div
                                            key={club.id}
                                            className="profile-club-card"
                                            onClick={() => navigate(`/clubHome/${club.id}`)}
                                        >
                                            <div className="profile-club-avatar">{club.name[0]}</div>
                                            <div className="profile-club-info">
                                                <h6 className="mb-1">{club.name}</h6>
                                                <p className="text-muted small mb-0">
                                                    {club.description || "No description"}
                                                </p>
                                            </div>
                                            <span className="profile-club-arrow">›</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
        </GenLayout>
    );
}

export default ProfilePage;
