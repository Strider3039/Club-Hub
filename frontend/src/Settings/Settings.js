import GenLayout from "../Layout/GeneralLayout";
import {Container, Row, Col, Button, Modal} from "react-bootstrap";
import profilePhoto from "../assets/profile-photo.jpg";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import authAxios from "../utils/authAxios";
import Form from "react-bootstrap/Form";





function Settings() {
    const [showChangePassForm, setShowChangePassForm] = useState(false);
    const [showDeleteAccountForm, setShowDeleteAccountForm ] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        clubs: ["Clubs they will sign up too"],
        bio: "editable bio for everyone"
    });

    const navigate = useNavigate();

    const changePasswordButton = async () => {
        try {
            const response = await authAxios.post("/change-password/", {
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: newPasswordConfirm,
            });

            console.log(response.data.message);
            alert("Password updated successfully!");

            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");

            setNewPassword("");
            setCurrentPassword("");
            setNewPasswordConfirm("");

            navigate("/login");
            window.location.reload();
        } catch (error) {
            console.error(error.response?.data?.error);
            alert(error.response?.data?.error || "Failed to update password.");
        }
    };

    const deleteButtonClick = async () => {
        try {
            const response = await authAxios.post("/delete-account/", {
                password_confirmation: passwordConfirmation,
            });

            console.log(response.data.message);
            alert("Account deleted successfully!");

            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");

            setPasswordConfirmation("");

            navigate("/login");
            window.location.reload();
        } catch (error) {
            console.error(error.response?.data?.error);
            alert(error.response?.data?.error || "Failed to delete account.");
        }
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser({
                ...storedUser,
                clubs: storedUser.clubs || [],
            });
        } else {
            console.warn("No user data found in localStorage.");
        }
    }, []);



    return (
        <GenLayout pageTitle={"Settings"}>
            <Container fluid className="vh-100 mt-0 p-4 flex-column bg-light">
                <Row className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                    <div className="ProfilePanel">
                        <div className="p-4 text-center">
                            <img src={profilePhoto} alt={"profile photo"} className="rounded-circle" style={{ width: '100px', height: '100px', marginTop: '20px'}}></img>
                            <div className="mt-3">
                                <Button variant="light" className="mb-2">edit photo</Button>
                                <hr />
                                <Button variant="light" className="mb-3">edit bio</Button>
                                <div className="mt-4">
                                    <Button
                                        variant="dark"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => setShowChangePassForm(!showChangePassForm)}
                                    >
                                        change password
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => setShowDeleteAccountForm(!showDeleteAccountForm)}
                                    >
                                        delete account
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
                <Modal show={showChangePassForm}
                       onHide={() => {
                           setShowChangePassForm(false);
                           setCurrentPassword("");
                           setNewPassword("");
                           setNewPasswordConfirm("");
                       }}
                       centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Change Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control
                                    style={{ marginBottom: "10px" }}
                                    type="password"
                                    placeholder="Current password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                                <Form.Control
                                    style={{ marginBottom: "10px" }}
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <Form.Control
                                    style={{ marginBottom: "10px" }}
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={newPasswordConfirm}
                                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                        <Button
                            className="me-2"
                            onClick={() => changePasswordButton()}
                        >
                            Change Password
                        </Button>
                    </Modal.Body>
                </Modal>
            <Modal show={showDeleteAccountForm}
                   onHide={() => {
                       setShowDeleteAccountForm(false);
                       setPasswordConfirmation("")
                   }}
                   centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control
                                style={{ marginBottom: "10px" }}
                                type="password"
                                placeholder="Current password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                    <Button
                        className="me-2"
                        variant="danger"
                        onClick={() => deleteButtonClick()}
                    >
                        DELETE ACCOUNT
                    </Button>
                </Modal.Body>
            </Modal>
        </GenLayout>
    );
}

export default Settings;