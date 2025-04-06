import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import "./ClubSearch.css"; // Updated CSS
import { useNavigate } from "react-router-dom";
import authAxios from "../utils/authAxios";
import Button from "react-bootstrap/Button";

function ClubSearch() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [clubs, setClubs] = useState([]);
    const [filteredClubs, setFilteredClubs] = useState([]);

    // Fetch all clubs on component mount
    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await authAxios.get("/clubs/list/");
                setClubs(response.data);
                setFilteredClubs(response.data);
            } catch (error) {
                console.error("Failed to fetch clubs:", error.response?.data || error.message);
            }
        };

        fetchClubs();
    }, []);

    // Update search term and filtered clubs as the user types
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filtered = clubs.filter((club) =>
            club.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredClubs(filtered);
    };

    // Navigate to a detail page for the selected club
    const handleClubClick = (clubId) => {
        navigate(`/clubHome/${clubId}`);
    };


    const handleRegister = () => {
        navigate("/clubRegister");
    };

    return (
        <div className="clubs-page">
            <NavBar page="ClubSearch" />
            <div className="clubs-container">
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
                                <li
                                    key={club.id}
                                    className="club-item"
                                    onClick={() => handleClubClick(club.id)} // Make it clickable
                                >
                                    <h4>{club.name}</h4>
                                    <p>{club.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Create Club Button */}
                <Button className="create-button" onClick={handleRegister}>
                    Create Club
                </Button>
            </div>
        </div>
    );
}

export default ClubSearch;
