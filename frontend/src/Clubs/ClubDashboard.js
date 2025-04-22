import React, {useEffect} from "react";
import { Container, Row, Col } from "react-bootstrap";
import Calendar from "./ClubCalendar";
import { useParams } from "react-router-dom";
import GenLayout from "../Layout/GeneralLayout"
import SideButton from "../CustomSideButton/CustomeSideButton"
import authAxios from "../utils/authAxios";

function ClubDashboard() {
    const [members, setMembers] = React.useState([]); // list of club members
    const [hasPermission, setHasPermission] = React.useState(false);
    // Get the club ID from the URL parameter
    const { id } = useParams();

    useEffect(() => {
        getMembers();
    },[])

    const getMembers = async () => {
        try
        {
            const response = await authAxios.get(`membershipList/${id}/`);
            setMembers(response.data); // data includes user_id, username, position
            console.log("Membership list", response);
        }
        catch (error) {
            console.error("Error fetching Member list: ", error);
        }
    }






    return (
        <GenLayout

            buttons={
                <SideButton
                    text={"Members"}
                    // onClick={}
                >
                </SideButton>
            }
        >

            <Container fluid className="vh-100 mt-0 p-4 flex-column bg-light">
                <Row className="align-items-start flex-grow-1 mb-3 text-center">
                    <Col className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        <Calendar clubId={id} />
                    </Col>

                    <Col xs={6} className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        This column is wider. It will contain the club description, announcements, etc.
                    </Col>

                    <Col className="p-3 m-2 bg-light border border-dark-subtle text-dark rounded">
                        {/*members are listed here*/}
                        <ul className="list-unstyled">
                            {members.map((member, index) => (
                                <li key={index} className="mb-2">
                                    <strong>{member.username}</strong> — {member.position}
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            </Container>
        </GenLayout>
    );
}

export default ClubDashboard;
