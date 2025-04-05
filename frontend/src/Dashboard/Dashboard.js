import React, {useEffect, useState} from "react";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
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
    const navigate = useNavigate(); // Hook for navigation


    const changePasswordButton = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "${process.env.REACT_API_URL}/change-password/",
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                    confirm_password: newPasswordConfirm,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response.data.message);
            alert("Password updated successfully!");

            // Remove the token from localStorage
            localStorage.removeItem("token");

            // Redirect to login page
            navigate("/login");
            window.location.reload();
        } catch (error) {
            console.error(error.response.data.error);
            alert(error.response.data.error || "Failed to update password.");
        }
    };

    const deleteButtonClick = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "${process.env.REACT_API_URL}/delete-account/",
                {
                    password_confirmation: passwordConfirmation,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response.data.message);
            alert("Account deleted successfully!");

            // Remove the token from localStorage
            localStorage.removeItem("token");

            // Redirect to login page
            navigate("/login");
            window.location.reload();
        } catch (error) {
            console.error(error.response.data.error);
            alert(error.response.data.error || "Failed to delete account.");
        }
    };

    useEffect(() => {
        // Retrieve user details from localStorage (if stored after login/registration)
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser) {
            setUser({
                ...storedUser,
                clubs: storedUser.clubs || [], // fallback in case clubs is missing
            });
        } else {
            console.warn("No user data found in localStorage.");
        }
    }, []);

    return (
        <div className="dashboard">
            <NavBar page={"Dashboard"}/>
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
                        type="text"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setInput1(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setInput2(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Confirm New Password"
                        value={newPasswordConfirm}
                        onChange={(e) => setInput3(e.target.value)}
                    />
                    <button onClick={changePasswordButton}>Change Password</button>
                </div>

                {/* Delete Account */}
                <div className="delete-account-box">
                    <input
                        type="text"
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
