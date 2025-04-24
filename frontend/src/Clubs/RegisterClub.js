import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authAxios from "../utils/authAxios";
import "./RegisterClub.css";
import Button from "react-bootstrap/Button";

function RegisterClub() {
    const navigate = useNavigate();

    const [clubName, setClubName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleBack = () => {
        navigate("/clubs");
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const clubData = {
            name: clubName,
            description: description,
        };

        try {
            const response = await authAxios.post("/clubs/", clubData);

            if (response.status === 201) {
                setSuccess("Club registered successfully!");
                setError("");
                navigate("/clubs");
            }
        } catch (err) {
            console.error("Backend error:", err.response?.data || err.message);
            if (err.response && err.response.data) {
                setError(err.response.data.message || JSON.stringify(err.response.data));
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="ClubRegister">
            <h1>Register Club</h1>
            <form onSubmit={handleRegister}>
                <input
                    className="clubName"
                    type="text"
                    placeholder="Club Name"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                />
                <textarea
                    className="clubDescription"
                    placeholder="Give your club a description!"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <Button variant="link" className="bg-transparent text-black" onClick={handleBack}>
                Back to Club Search
            </Button>
        </div>
    );
}

export default RegisterClub;
