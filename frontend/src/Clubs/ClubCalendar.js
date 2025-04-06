import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import authAxios from "../utils/authAxios"; // ✅ Custom Axios with token auto-refresh

function ClubCalendar({ clubId }) {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [description, setDescription] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState(new Date());

    // Load events when component mounts
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/clubs/events?club_id=${clubId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                setEvents(response.data);
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };

    // create a new event
    const createNewEvent = async (eventName, eventDate) => {
        if (!eventName || !eventDate) {
            setError("Both event name and date are required.");
            return;
        }

        const eventData = {
            title: eventName,
            description: description,
            date: eventDate.toISOString(),
            club: clubId  // ✅ Include club ID
        };

        const token = localStorage.getItem("token");

        try {
            const response = await authAxios.post("/clubs/events/", eventData); // ✅ Replaced axios with authAxios

            // update the locally stored events
            setEvents(prevEvents => [...prevEvents, response.data]);

            // clear the form data
            setEventName("");
            setDescription("");
            setEventDate(new Date());
            setError("");
            setShowForm(false);
        } catch (error) {
            console.error("Event creation failed:", error.response?.data || error.message);
            setError("Failed to create event. Please try again.");
        }
    };

    return (
        <div>
            <h3>{date.toDateString()}</h3>

            <Button className={"m-2 mt-0"} onClick={() => setShowForm(true)}>
                Add Event
            </Button>

            <Calendar
                onChange={setDate}
                onClickDay={(clickedDate) => {
                    setEventDate(clickedDate);
                    setShowForm(true);
                }}
                value={date}
                tileContent={({ date }) => {
                    const dateStr = date.toISOString().split("T")[0];
                    const event = events.find(event => event.date.split("T")[0] === dateStr);

                    if (event) {
                        const popover = (
                            <Popover id={`popover-${dateStr}`}>
                                <Popover.Header as="h3">{event.title}</Popover.Header>
                                <Popover.Body>
                                    {new Date(event.date).toDateString()}
                                </Popover.Body>
                            </Popover>
                        );

                        return (
                            <OverlayTrigger trigger="click" placement="left" overlay={popover} rootClose>
                                <div style={{
                                    backgroundColor: "red",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    margin: "auto",
                                    cursor: "pointer"
                                }} />
                            </OverlayTrigger>
                        );
                    }

                    return null;
                }}
            />

            {showForm && (
                <div className="NewEventForm">
                    <h3>New Event</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            createNewEvent(eventName, eventDate);
                        }}
                    >
                        <input
                            style={{ marginRight: "2px", width: "fit-content" }}
                            type="text"
                            placeholder="Event Name"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                        />
                        <input
                            style={{ marginLeft: "2px", width: "fit-content" }}
                            type="date"
                            value={eventDate.toISOString().split("T")[0]}
                            onChange={(e) => setEventDate(new Date(e.target.value))}
                        />
                        <textarea
                            style={{ marginLeft: "2px", width: "fit-content" }}
                            className="eventDescription"
                            placeholder="What's going on!"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <Button className={"m-2 mb-0"} type="submit">
                            Submit
                        </Button>
                    </form>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            )}
        </div>
    );
}

export default ClubCalendar;
