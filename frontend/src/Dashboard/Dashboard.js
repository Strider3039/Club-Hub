import React, { useEffect, useState } from "react";
import authAxios from "../utils/authAxios";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        clubs: ["Clubs they will sign up too"],
        bio: "editable bio for everyone"
    });

    const [currentPassword, setInput1] = useState("");
    const [newPassword, setInput2] = useState("");
    const [newPasswordConfirm, setInput3] = useState("");
    const [passwordConfirmation, setInput4] = useState("");

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
        <div className="dashboard">
            <div className="dashboard-container">
                <div className="profile-card">
                    <h2>{user.firstName} {user.lastName}</h2>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <h3>Clubs</h3>
                    <ul>
                        {Array.isArray(user.clubs) ? (
                            user.clubs.map((club, index) => (
                                <li key={index}>{club}</li>
                            ))
                        ) : (
                            <li>No clubs found</li>
                        )}
                    </ul>
                    <p className="bio">{user.bio}</p>
                </div>

                {/* Change Password */}
                <div className="change-password-box">
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setInput1(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setInput2(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={newPasswordConfirm}
                        onChange={(e) => setInput3(e.target.value)}
                    />
                    <button onClick={changePasswordButton}>Change Password</button>
                </div>

                {/* Delete Account */}
                <div className="delete-account-box">
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={passwordConfirmation}
                        onChange={(e) => setInput4(e.target.value)}
                    />
                    <button onClick={deleteButtonClick}>Delete Account</button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
