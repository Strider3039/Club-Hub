import React, { useEffect, useState } from "react";
import authAxios from "../utils/authAxios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import GenLayout from "../Layout/GeneralLayout";

function Dashboard() {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
    });

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        setUser({
            firstName: storedUser.first_name || "",
            lastName:  storedUser.last_name  || "",
            username:  storedUser.username   || "",
            email:     storedUser.email      || "",
        });
    }, []);

    const handleChangePassword = async () => {
        try {
            await authAxios.post("/change-password/", {
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: newPasswordConfirm,
            });

            alert("Password updated successfully. Please log in again.");
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");
            localStorage.removeItem("username");
            navigate("/login");
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.error || "Failed to update password.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) return;

        try {
            await authAxios.post("/delete-account/", {
                password_confirmation: passwordConfirmation,
            });

            alert("Account deleted.");
            localStorage.clear();
            navigate("/login");
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.error || "Failed to delete account.");
        }
    };

    return (
        <GenLayout pageTitle="Account Settings">
            <div className="dashboard">
                <div className="dashboard-container">
                    {/* Profile summary */}
                    <div className="profile-card">
                        <h2>{user.firstName} {user.lastName}</h2>
                        <p><strong>@{user.username}</strong></p>
                        <p>{user.email}</p>
                    </div>

                    {/* Change Password */}
                    <div className="change-password-box">
                        <h4>Change Password</h4>
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={newPasswordConfirm}
                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        />
                        <button onClick={handleChangePassword}>Update Password</button>
                    </div>

                    {/* Delete Account */}
                    <div className="delete-account-box">
                        <h4>Delete Account</h4>
                        <p style={{ color: "#6c757d", fontSize: 13, margin: 0 }}>
                            This action is permanent and cannot be undone.
                        </p>
                        <input
                            type="password"
                            placeholder="Enter your password to confirm"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                        <button onClick={handleDeleteAccount}>Delete My Account</button>
                    </div>
                </div>
            </div>
        </GenLayout>
    );
}

export default Dashboard;
