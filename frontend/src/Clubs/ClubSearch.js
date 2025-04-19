import React, { useState, useEffect } from "react";
import "./ClubSearch.css";
import { useNavigate } from "react-router-dom";
import authAxios from "../utils/authAxios";
import Button from "react-bootstrap/Button";
import { Container, Row, Col } from "react-bootstrap";
import GenLayout from "../Layout/GeneralLayout";

function ClubSearch() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [clubs, setClubs] = useState([]);
    const [filteredClubs, setFilteredClubs] = useState([]);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await authAxios.get("/clubs/list/", { params: { club_id: 1 } });
                setClubs(response.data);
                setFilteredClubs(response.data);
            } catch (error) {
                console.error("Failed to fetch clubs:", error.response?.data || error.message);
            }
        };

        fetchClubs();
    }, []);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filtered = clubs.filter((club) =>
            club.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredClubs(filtered);
    };

    const handleClubClick = (clubId) => {
        navigate(`/clubHome/${clubId}`);
    };

    const handleRegister = () => {
        navigate("/clubRegister");
    };

    const handleJoinClub = async (e, clubId) => {
        e.stopPropagation();
        try {
            await authAxios.post(`/clubs/join/${clubId}/`);
            const updatedClubs = clubs.map(club =>
                club.id === clubId ? { ...club, is_member: true } : club
            );
            setClubs(updatedClubs);
            const updatedFiltered = updatedClubs.filter((club) =>
                club.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredClubs(updatedFiltered);
        } catch (error) {
            console.error("Failed to join club:", error.response?.data || error.message);
        }
    };

    return (
        <GenLayout pageTitle={"ClubSearch"}>
            <Container fluid style={{ backgroundColor: "#fdfcf7" }} className="vh-100 mt-0 p-4 flex-column">
                <Row className="align-items-start flex-grow-1 mb-3 text-center">
                    <Col></Col>
                    <Col xs={1}>
                        <Button className="create-button" onClick={handleRegister}>
                            Create Club
                        </Button>
                    </Col>
                    <Col xs={12} md={6} className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search clubs..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        <div className="clubs-list">
                            <h5 className="mb-3 text-secondary">
                                Showing results for <strong>{searchTerm || "All Clubs"}</strong>
                            </h5>

                            <div className="clubs-list" style={{ maxHeight: "80vh", overflowY: "auto" }}>
                                <ul className="list-group">
                                    {filteredClubs.map((club) => (
                                        <li
                                            key={club.id}
                                            className="list-group-item list-group-item-action mb-2 rounded d-flex justify-content-between align-items-center"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleClubClick(club.id)}
                                        >
                                            <div>
                                                <h5 className="mb-1 fw-bold">{club.name}</h5>
                                                <p className="mb-0 text-muted">{club.description}</p>
                                            </div>
                                            <Button
                                                variant={club.is_member ? "success" : "primary"}
                                                disabled={club.is_member}
                                                onClick={(e) => handleJoinClub(e, club.id)}
                                            >
                                                {club.is_member ? "Joined" : "Join"}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </GenLayout>
    );
}

export default ClubSearch;
