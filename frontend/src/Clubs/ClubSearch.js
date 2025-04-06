import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import "./ClubSearch.css";
import { useNavigate } from "react-router-dom";
import authAxios from "../utils/authAxios";
import Button from "react-bootstrap/Button";

function ClubSearch() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [clubs, setClubs] = useState([]);

    // Fetch all clubs on component mount
    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await authAxios.get("/clubs/list/"); // ✅ no need to set headers
                setClubs(response.data);
            } catch (error) {
                console.error("Failed to fetch clubs:", error.response?.data || error.message);
            }
        };

        fetchClubs();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRegister = () => {
        navigate("/clubRegister");
    };

    // Filter clubs by search term
    const filteredClubs = clubs.filter((club) =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="clubs-page">
            <NavBar page="ClubSearch" />
            <div className="clubs-container">
                {/* Search bar */}
                <div className="clubs-content">
                    <input
                        type="text"
                        placeholder="Search clubs..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <div className="clubs-list">
                        <p>Showing results for "{searchTerm || "All Clubs"}"</p>
                        <ul className="club-results">
                            {filteredClubs.map((club) => (
                                <li key={club.id} className="club-item">
                                    <h4>{club.name}</h4>
                                    <p>{club.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Button onClick={handleRegister}>
                Create Club
            </Button>
        </div>
    );
}

export default ClubSearch;
