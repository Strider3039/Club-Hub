import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import "./ClubSearch.css"; // Updated CSS
import { useNavigate } from "react-router-dom";
import authAxios from "../utils/authAxios";
import Button from "react-bootstrap/Button";
import { Container, Row, Col } from "react-bootstrap";

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
        <>
            <NavBar page="ClubSearch" />
                <Container fluid style={{ backgroundColor: "#fdfcf7" }} className="vh-100 mt-0 p-4 flex-column">
                    <Row className="align-items-start flex-grow-1 mb-3 text-center">
                        <Col></Col>
                        <Col xs={1}>
                            {/* Create Club Button */}
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

                                <ul className="list-group">
                                    {filteredClubs.map((club) => (
                                        <li
                                            key={club.id}
                                            className="list-group-item list-group-item-action mb-2 rounded"
                                            style={{cursor: "pointer"}}
                                            onClick={() => handleClubClick(club.id)}
                                        >
                                            <h5 className="mb-1 fw-bold">{club.name}</h5>
                                            <p className="mb-0 text-muted">{club.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
        </>
    );
}

export default ClubSearch;
