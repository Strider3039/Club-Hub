import React, { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';


// Calendar component that will handle logic for pulling club events. user can add events
function ClubCalendar() {
    const [date, setDate] = useState(new Date()); // for showing real-time date
    const [events, setEvents] = useState([]); // stores event names & dates
    const [showForm, setShowForm] = useState(false); // should we collect user input?
    const [error, setError] = useState(""); // holds error message
    const [eventName, setEventName] = useState(""); // new event name
    const [eventDate, setEventDate] = useState(new Date()); // new event date

    const createNewEvent = (eventName, eventDate) => {
        // Validate that both event name and date are provided
        if (!eventName || !eventDate) {
            setError("Both event name and date are required.");
            return;
        }

        // this line adds events to events list
        setEvents(prevEvents => [...prevEvents, { name: eventName, date: eventDate }]);

        // resets input fields
        setEventName("");
        setEventDate(new Date());
        setError("");

        // Close the form popup
        setShowForm(false);
    };

    // const popover = (
    //     <Popover id="popover-basic">
    //         <Popover.Header as="h3">{eventName}</Popover.Header>
    //         <Popover.Body>
    //             {eventDate}
    //         </Popover.Body>
    //     </Popover>
    // );

    return (
        <div>
            <h3>{date.toDateString()}</h3>

            {/* button to trigger adding a new event */}
            <Button
                className={"m-2 mt-0"}
                onClick={(e) => setShowForm(true)}
                onClickDay={(e) => setEventDate(e.date) & setShowForm(true)}
            >
                Add Event
            </Button>

            <Calendar
                onChange={setDate}
                onClickDay={(clickedDate) => setEventDate(clickedDate) & setShowForm(true)}
                value={date}
                tileContent={({ date, view }) => {
                    const dateStr = date.toISOString().split("T")[0];
                    const event = events.find(event => event.date.toISOString().split("T")[0] === dateStr);

                    if (event) {
                        const popover = (
                            <Popover id={`popover-${dateStr}`}>
                                <Popover.Header as="h3">{event.name}</Popover.Header>
                                <Popover.Body>
                                    {event.date.toDateString()}
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

            { showForm && (
                <div className={"NewEventForm"}>
                    <h3>New Event</h3>
                    <form onSubmit={(e) => {e.preventDefault(); createNewEvent(eventName, eventDate);
                    }}>
                        <input
                            style={{marginRight: "2px", width: "fit-content"}}
                            type="text"
                            placeholder="Event Name"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                        />
                        <input
                            style={{marginLeft: "2px", width: "fit-content"}}
                            type="date"
                            value={eventDate.toISOString().split("T")[0]}
                            onChange={(e) => setEventDate(new Date(e.target.value))}
                        />
                        <Button
                            className={"m-2 mb-0"}
                            onClick={(e) => createNewEvent(eventName, eventDate)}
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