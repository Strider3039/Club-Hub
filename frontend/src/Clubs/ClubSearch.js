import React, { useState, useEffect } from "react";
import "./ClubSearch.css";
import { useNavigate } from "react-router-dom";
import authAxios from "../utils/authAxios";
import { Button, Spinner } from "react-bootstrap";
import GenLayout from "../Layout/GeneralLayout";

function ClubSearch() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [clubs, setClubs] = useState([]);
    const [filteredClubs, setFilteredClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await authAxios.get("/clubs/list/");
                setClubs(response.data);
                setFilteredClubs(response.data);
            } catch (error) {
                console.error("Failed to fetch clubs:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchClubs();
    }, []);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setFilteredClubs(
            clubs.filter((club) => club.name.toLowerCase().includes(term.toLowerCase()))
        );
    };

    const handleClubClick = (clubId) => navigate(`/clubHome/${clubId}`);
    const handleRegister = () => navigate("/clubRegister");

    const handleJoinClub = async (e, clubId) => {
        e.stopPropagation();
        try {
            await authAxios.post(`/clubs/join/${clubId}/`);
            const updatedClubs = clubs.map(club =>
                club.id === clubId ? { ...club, is_member: true } : club
            );
            setClubs(updatedClubs);
            setFilteredClubs(
                updatedClubs.filter((club) => club.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        } catch (error) {
            console.error("Failed to join club:", error.response?.data || error.message);
        }
    };

    return (
        <GenLayout pageTitle="Clubs">
            <div className="page-wrapper">
                <div className="page-header">
                    <div>
                        <h2>Browse Clubs</h2>
                        <p className="page-header-subtitle">Find a community and join the conversation.</p>
                    </div>
                    <Button variant="danger" onClick={handleRegister}>
                        + Create Club
                    </Button>
                </div>

                <div className="app-card">
                    <div className="app-card-header">
                        <h6 className="app-card-title">
                            {searchTerm ? `Results for "${searchTerm}"` : "All Clubs"}
                        </h6>
                        <span className="friends-badge">{filteredClubs.length}</span>
                    </div>

                    <div className="club-search-bar">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search clubs by name..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="danger" />
                        </div>
                    ) : filteredClubs.length === 0 ? (
                        <div className="club-search-empty">
                            <p className="text-muted mb-3">No clubs found.</p>
                            <Button variant="danger" onClick={handleRegister}>
                                Create the first one
                            </Button>
                        </div>
                    ) : (
                        <div className="club-search-grid">
                            {filteredClubs.map((club) => (
                                <div
                                    key={club.id}
                                    className="club-search-card"
                                    onClick={() => handleClubClick(club.id)}
                                >
                                    <div className="club-search-avatar">{club.name[0]}</div>
                                    <div className="club-search-info">
                                        <h6 className="mb-1">{club.name}</h6>
                                        <p className="text-muted small mb-0">
                                            {club.description || "No description"}
                                        </p>
                                    </div>
                                    <Button
                                        variant={club.is_member ? "success" : "danger"}
                                        disabled={club.is_member}
                                        size="sm"
                                        onClick={(e) => handleJoinClub(e, club.id)}
                                    >
                                        {club.is_member ? "✓ Joined" : "Join"}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </GenLayout>
    );
}

export default ClubSearch;
