import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authAxios from "../utils/authAxios"; // ✅ Use the custom axios
import "./RegisterClub.css";
import Button from "react-bootstrap/Button";

function RegisterClub() {
    const navigate = useNavigate();

    const [clubName, setClubName] = useState("");
    const [description, setDescription] = useState("");
    const [members, setMembers] = useState([]);
    const [officers, setOfficers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // On load: get current user and set them as the first club member
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user && user.id) {
                    setCurrentUserId(user.id);
                    setMembers([user.id]);
                    setOfficers([user.id]);
                } else {
                    setError("Invalid user data. Please log in again.");
                }
            } catch (err) {
                console.error("Failed to parse user:", err);
                setError("Error reading user info.");
            }
        } else {
            setError("You must be logged in to register a club.");
        }
    }, []);

    const handleBack = () => {
        navigate("/clubs");
    }

    // Handle form submission
    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const clubData = {
            name: clubName,
            description: description,
            members: members,
            officers: officers,
        };

        try {
            const response = await authAxios.post("/clubs/", clubData); // ✅ Use authAxios

            if (response.status === 201) {
                setSuccess("Club registered successfully!");
                setError("");
                navigate("/clubHome");
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
            <Button variant="secondary" className={"bg-secondary"} onClick={handleBack}>
                Back to Club Search
            </Button>
        </div>
    );
}

export default RegisterClub;
