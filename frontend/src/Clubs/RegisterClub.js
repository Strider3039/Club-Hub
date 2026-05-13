import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authAxios from "../utils/authAxios";
import "./RegisterClub.css";

function RegisterClub() {
    const navigate = useNavigate();

    const [clubName, setClubName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            setError("You must be logged in to register a club.");
        }
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await authAxios.post("/clubs/", {
                name: clubName,
                description: description,
            });

            if (response.status === 201) {
                setSuccess("Club registered successfully!");
                navigate("/clubs");
            }
        } catch (err) {
            if (err.response?.data) {
                setError(err.response.data.message || JSON.stringify(err.response.data));
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="ClubRegister">
            <div className="club-register-card">
                <h1>Create a Club</h1>
                <p className="register-subtitle">Start your community on ClubHub</p>

                <form onSubmit={handleRegister}>
                    <div className="club-register-field">
                        <label htmlFor="clubName">Club Name</label>
                        <input
                            id="clubName"
                            type="text"
                            placeholder="e.g. Photography Society"
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="club-register-field">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            className="clubDescription"
                            placeholder="Tell people what your club is about..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="club-register-submit-btn">
                        Create Club
                    </button>
                </form>

                {error   && <p className="register-feedback error">{error}</p>}
                {success && <p className="register-feedback success">{success}</p>}

                <div className="text-center mt-3">
                    <button
                        onClick={() => navigate("/clubs")}
                        style={{ background: "none", border: "none", color: "#A60F2D", cursor: "pointer", fontWeight: 500 }}
                    >
                        ← Back to Club Search
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterClub;
