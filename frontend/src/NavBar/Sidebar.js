import {Col, Row} from "react-bootstrap";
import SideButton from "../CustomSideButton/CustomeSideButton";
import React from "react";
import {Link} from "react-router-dom";
import Home from "../Home";
import LightLogo from "../assets/Logo_Club_Hub.png";


const Sidebar = () => (
    <div className="sidebar d-flex flex-column align-items-center py-4 ">
        {/* need custom button */}
            <Row noGutters>
                <Col noGutters>
                    <Link className="navbar-brand d-flex align-items-center" to="/home">
                        <img
                            src={LightLogo}
                            alt="ClubHub Logo"
                            width="80px"
                            height="80px"
                            className="me-2"
                            style={{marginBottom: "10px"}}
                        />
                    </Link>
                </Col>
            </Row>
        <Row noGutters>
            <Col className="ml-auto d-flex flex-column gap-2">
                <SideButton text={"Clubs"}/>
                <SideButton text={"Events"}/>
                <SideButton
                    text={"Friends"}
                    style={"popover"}
                    placement={"right-start"}
                    buttons={[
                        { text: "Add friends", onClick: () => console.log("Add friends") }, // these logs are just placeholders
                        { text: "Remove friends", onClick: () => console.log("Remove friends") },
                        { text: "View friends", onClick: () => console.log("View friends") },
                    ]}
                />
            </Col>
        </Row>

    </div>
);

export default Sidebar;