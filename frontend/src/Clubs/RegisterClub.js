import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterClub.css";

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

        // get the current user from local storage
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.id) {
            setCurrentUserId(user.id);
            setMembers([user.id]);
            setOfficers([user.id]);
        } else {
            setError("You must be logged in to register a club.");
        }
    }, []);

    // Handle form submission
    const handleRegister = async (e) => {
        // prevent default form submission
        e.preventDefault();
        setError("");
        setSuccess("");

    // validate input
    const token = localStorage.getItem("token");
        // make sure the user is logged in
        if (!token) {
        setError("Missing authentication token. Please log in again.");
        return;
        }

        // create the data that will be sent to the backend
        const clubData = {
        name: clubName,
        description: description,
        members: members,
        officers: officers,
        };

        // make the API listening request to the backend
        try {
        const response = await axios.post("${process.env.REACT_API_URL}/clubs/", clubData, {
                // add the token to the request headers
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        // check that the club was created successfully
        if (response.status === 201) {
            setSuccess("Club registered successfully!");
            setError("");
            navigate("/clubHome");
        }
        } catch (err) {
            // club registration failed
            if (err.response && err.response.data) {
                setError(err.response.data.message || "Failed to register club.");
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
        </div>
    );
}

export default RegisterClub;
// import React, { useState } from "react";