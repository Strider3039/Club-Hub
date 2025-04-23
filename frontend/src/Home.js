import React from "react";
import Layout from "./Layout/Layout";
import GenLayout from "./Layout/GeneralLayout";
import { useNavigate } from "react-router-dom";
import { Card, Button, ListGroup } from "react-bootstrap";

function Home() {
    const navigate = useNavigate();

    return (
        <GenLayout pageTitle={"Home"}>
            <Layout
                leftContentHeader={"Quick Actions"}
                leftContentBody={
                    <ListGroup variant="flush">
                        <ListGroup.Item action onClick={() => navigate("/clubs")}>Browse Clubs</ListGroup.Item>
                        <ListGroup.Item action onClick={() => navigate("/events")}>Upcoming Events</ListGroup.Item>
                        <ListGroup.Item action onClick={() => navigate("/friends")}>Manage Friends</ListGroup.Item>
                        <ListGroup.Item action onClick={() => navigate("/clubs/join")}>Join New Club</ListGroup.Item>
                    </ListGroup>
                }
                middleContentHeader={"Welcome to ClubHub"}
                middleContentBody={
                    <Card className="text-center shadow">
                        <Card.Body>
                            <Card.Title>Welcome Back!</Card.Title>
                            <Card.Text>
                                Discover new clubs, manage your memberships, and connect with fellow students.
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate("/clubs")}>Explore Clubs</Button>
                        </Card.Body>
                    </Card>
                }
                rightContentHeader={"Highlights"}
                rightContentBody={
                    <div>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Event: Game Night</Card.Title>
                                <Card.Text>Friday at 7 PM — Board Games Club</Card.Text>
                                <Button size="sm" onClick={() => navigate("/events")}>View Event</Button>
                            </Card.Body>
                        </Card>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>New Club: Art Society</Card.Title>
                                <Card.Text>Express yourself through painting and sketching!</Card.Text>
                                <Button size="sm" onClick={() => navigate("/clubs")}>Check it Out</Button>
                            </Card.Body>
                        </Card>
                    </div>
                }
            />
        </GenLayout>
    );
}

export default Home;
