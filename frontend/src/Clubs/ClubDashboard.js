import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Modal, Button, Form } from "react-bootstrap";
import Calendar from "./ClubCalendar";
import GenLayout from "../Layout/GeneralLayout";
import SideButton from "../CustomSideButton/CustomeSideButton";
import authAxios from "../utils/authAxios";
import "./ClubDashboard.css";

function ClubDashboard() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [members, setMembers] = useState([]);
    const [myRole, setMyRole] = useState("");
    const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
    const [usernameToRemove, setUsernameToRemove] = useState("");
    const [showEditClubModal, setShowEditClubModal] = useState(false);
    const [clubDescription, setClubDescription] = useState("");
    const [clubName, setClubName] = useState("");
    const [announcements, setAnnouncements] = useState([]);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementBody, setAnnouncementBody] = useState("");

    useEffect(() => {
        getMembers();
        getClubInfo();
        getAnnouncements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getMembers = async () => {
        try {
            const response = await authAxios.get(`membershipList/${id}/`);
            setMembers(response.data);
            const myEntry = response.data.find(m => m.username === localStorage.getItem("username"));
            if (myEntry) setMyRole(myEntry.position);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const getClubInfo = async () => {
        try {
            const response = await authAxios.get(`/clubs/${id}/`);
            setClubDescription(response.data.description);
            setClubName(response.data.name);
        } catch (error) {
            console.error("Error fetching club info:", error);
        }
    };

    const getAnnouncements = async () => {
        try {
            const response = await authAxios.get(`/clubs/announcements/${id}/`);
            setAnnouncements(response.data);
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    const handlePostAnnouncement = async () => {
        if (!announcementTitle.trim() || !announcementBody.trim()) return;
        try {
            await authAxios.post(`/clubs/announcements/${id}/`, {
                title: announcementTitle,
                description: announcementBody,
                date: new Date().toISOString(),
            });
            setAnnouncementTitle("");
            setAnnouncementBody("");
            setShowAnnouncementModal(false);
            getAnnouncements();
        } catch (error) {
            alert("Failed to post announcement.");
        }
    };

    const handleEditClub = async () => {
        try {
            await authAxios.patch(`/clubs/update/${id}/`, {
                name: clubName,
                description: clubDescription,
            });
            alert("Club updated successfully.");
            setShowEditClubModal(false);
        } catch (error) {
            alert("Failed to update club.");
        }
    };

    const handleDeleteClub = async () => {
        if (!window.confirm("Are you sure you want to delete this club?")) return;
        try {
            await authAxios.delete(`/clubs/delete/${id}/`);
            alert("Club deleted successfully.");
            navigate("/clubs");
        } catch (error) {
            alert("Failed to delete club.");
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await authAxios.patch(`/membershipUpdate/${id}/${userId}/`, {
                position: newRole,
            });
            getMembers();
        } catch (error) {
            alert("Failed to update role.");
        }
    };

    const handleRemoveMember = async (userName) => {
        if (!window.confirm("Remove this member?")) return;
        try {
            const member = members.find(m => m.username === userName);
            if (member) {
                await authAxios.delete(`/membershipDelete/${id}/${member.user_id}/`);
                getMembers();
                setUsernameToRemove("");
                setShowRemoveMemberModal(false);
            }
        } catch (error) {
            alert("Failed to remove member.");
        }
    };

    const canManage = ["President", "Vice President"].includes(myRole);
    const isPresident = myRole === "President";

    const roleBadgeClass = (pos) => {
        if (pos === "President") return "club-role-badge club-role-president";
        if (pos === "Vice President") return "club-role-badge club-role-vp";
        if (pos === "officer" || pos === "Officer") return "club-role-badge club-role-officer";
        return "club-role-badge club-role-member";
    };

    return (
        <GenLayout
            pageTitle={clubName || "Club"}
            buttons={
                canManage && (
                    <SideButton
                        text={"Manage Club"}
                        style={"popover"}
                        placement={"right-start"}
                        buttons={[
                            { text: "Post Announcement", onClick: () => setShowAnnouncementModal(true) },
                            { text: "Remove Member",    onClick: () => setShowRemoveMemberModal(true) },
                            { text: "Edit Club Info",   onClick: () => setShowEditClubModal(true) },
                        ]}
                    />
                )
            }
        >
            <div className="page-wrapper">
                <div className="page-header">
                    <div>
                        <h2>{clubName}</h2>
                        <p className="page-header-subtitle">{clubDescription || "No description"}</p>
                    </div>
                    {isPresident && (
                        <Button variant="outline-danger" size="sm" onClick={handleDeleteClub}>
                            Delete Club
                        </Button>
                    )}
                </div>

                {/* Announcements */}
                <div className="app-card mb-4">
                    <div className="app-card-header">
                        <h6 className="app-card-title">Announcements</h6>
                        <div className="d-flex align-items-center gap-2">
                            <span className="friends-badge">{announcements.length}</span>
                            {canManage && (
                                <Button variant="danger" size="sm" onClick={() => setShowAnnouncementModal(true)}>
                                    + Post
                                </Button>
                            )}
                        </div>
                    </div>
                    {announcements.length === 0 ? (
                        <div className="friends-empty">
                            <p className="text-muted mb-0">No announcements yet.</p>
                        </div>
                    ) : (
                        <ul className="announcement-list">
                            {announcements.slice(0, 5).map((a) => (
                                <li key={a.id} className="announcement-item">
                                    <div className="announcement-header">
                                        <h6 className="announcement-title">{a.title}</h6>
                                        <span className="announcement-date">
                                            {new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="announcement-body">{a.description}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <Row className="g-4">
                    {/* Calendar */}
                    <Col xs={12} lg={5}>
                        <div className="app-card">
                            <div className="app-card-header">
                                <h6 className="app-card-title">Calendar</h6>
                            </div>
                            <Calendar clubId={id} />
                        </div>
                    </Col>

                    {/* About */}
                    <Col xs={12} lg={4}>
                        <div className="app-card">
                            <div className="app-card-header">
                                <h6 className="app-card-title">About</h6>
                            </div>
                            <div className="club-detail-list">
                                <div className="club-detail-row">
                                    <span className="club-detail-label">Name</span>
                                    <span className="club-detail-value">{clubName}</span>
                                </div>
                                <div className="club-detail-row club-detail-row-block">
                                    <span className="club-detail-label">Description</span>
                                    <span className="club-detail-value">{clubDescription || "—"}</span>
                                </div>
                                <div className="club-detail-row">
                                    <span className="club-detail-label">Members</span>
                                    <span className="club-detail-value">{members.length}</span>
                                </div>
                                <div className="club-detail-row">
                                    <span className="club-detail-label">Your Role</span>
                                    <span className="club-detail-value">
                                        <span className={roleBadgeClass(myRole)}>{myRole || "—"}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Members */}
                    <Col xs={12} lg={3}>
                        <div className="app-card">
                            <div className="app-card-header">
                                <h6 className="app-card-title">Members</h6>
                                <span className="friends-badge">{members.length}</span>
                            </div>
                            <ul className="club-members-list">
                                {members.map((member) => (
                                    <li key={member.user_id} className="club-member-item">
                                        <div className="club-member-info">
                                            <div className="club-member-avatar">
                                                {member.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="club-member-name">{member.username}</div>
                                                <span className={roleBadgeClass(member.position)}>
                                                    {member.position}
                                                </span>
                                            </div>
                                        </div>
                                        {canManage && member.username !== localStorage.getItem("username") && (
                                            <Form.Select
                                                size="sm"
                                                defaultValue={member.position}
                                                className="club-member-role-select"
                                                onChange={(e) => handleUpdateRole(member.user_id, e.target.value)}
                                            >
                                                <option value="member">Member</option>
                                                <option value="officer">Officer</option>
                                                <option value="Vice President">Vice President</option>
                                                <option value="President">President</option>
                                            </Form.Select>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Remove Member Modal */}
            <Modal show={showRemoveMemberModal} onHide={() => setShowRemoveMemberModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Remove Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username..."
                                value={usernameToRemove}
                                onChange={(e) => setUsernameToRemove(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRemoveMemberModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={() => handleRemoveMember(usernameToRemove)}>Remove</Button>
                </Modal.Footer>
            </Modal>

            {/* Post Announcement Modal */}
            <Modal show={showAnnouncementModal} onHide={() => setShowAnnouncementModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Post Announcement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Announcement title..."
                                value={announcementTitle}
                                onChange={(e) => setAnnouncementTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="What would you like to announce?"
                                value={announcementBody}
                                onChange={(e) => setAnnouncementBody(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAnnouncementModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handlePostAnnouncement}>Post</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Club Info Modal */}
            <Modal show={showEditClubModal} onHide={() => setShowEditClubModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Club Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Club Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={clubName}
                                onChange={(e) => setClubName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={clubDescription}
                                onChange={(e) => setClubDescription(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditClubModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleEditClub}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </GenLayout>
    );
}

export default ClubDashboard;
