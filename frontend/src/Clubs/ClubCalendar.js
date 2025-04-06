import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import axios from 'axios';

function ClubCalendar() {
    const [date, setDate] = useState(new Date()); // for showing real-time date
    const [events, setEvents] = useState([]); // stores event names & dates
    const [description, setDescription] = useState("");
    const [showForm, setShowForm] = useState(false); // should we collect user input?
    const [error, setError] = useState(""); // holds error message
    const [eventName, setEventName] = useState(""); // new event name
    const [eventDate, setEventDate] = useState(new Date()); // new event date

    // create a new event
    const createNewEvent = async (eventName, eventDate) => {
        if (!eventName || !eventDate) {
            setError("Both event name and date are required.");
            return;
        }

        const eventData = {
            title: eventName,
            description: description,
            date: eventDate.toISOString()
        };

        const token = localStorage.getItem("token");


        try {
            // this requests the backend to create a new event
            // returns a thumbs up if it succeeds
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/clubs/events/`,
                eventData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
            },
            );

            // update the locally stored events
            setEvents(prevEvents => [...prevEvents, response.data]);

            // clear the form data
            setEventName("");
            setDescription("");
            setEventDate(new Date());
            setError("");
            setShowForm(false);
        } catch (error) {
            setError("Failed to create event. Please try again.");
        }
    };

    return (
        <div>
            <h3>{date.toDateString()}</h3>

            {/* button to trigger adding a new event */}
            <Button
                className={"m-2 mt-0"}
                onClick={(e) => setShowForm(true)}
            >
                Add Event
            </Button>

            <Calendar
                onChange={setDate}
                onClickDay={(clickedDate) => setEventDate(clickedDate) & setShowForm(true)}
                value={date}
                tileContent={({ date, view }) => {
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
                <div className={"NewEventForm"}>
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
                        <Button
                            className={"m-2 mb-0"}
                            type="submit"
                        >
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
