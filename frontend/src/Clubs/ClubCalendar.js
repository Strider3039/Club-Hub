import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Button from "react-bootstrap/Button";

// Calendar component that will handle logic for pulling club events
function ClubCalendar() {
    const [date, setDate] = useState(new Date()); // date initialized with the real-time date from (new Date())
    const [events, setEvents] = useState([]); // events initialized with an empty list. will store event items having a name and a date.
    const [showForm, setShowForm] = useState(false); // should we collect user input?
    const [error, setError] = useState("");
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");

    // this will handle adding event to calendar. will be called by onSubmit from the form.
    const createNewEvent = (eventName, eventDate) => {
        // Validate that both event name and date are provided
        if (!eventName || !eventDate) {
            setError("Both event name and date are required.");
            return;
        }

        // Convert the eventDate string into a Date object (if it isn't one already)
        const newEventDate = new Date(eventDate);

        // Add the new event to the events list
        setEvents(prevEvents => [...prevEvents, { name: eventName, date: newEventDate }]);

        // Reset the input fields and clear any error messages
        setEventName("");
        setEventDate("");
        setError("");

        // Close the form popup
        setShowForm(false);
    };



    return (
        <div>
            <h3>{date.toDateString()}</h3>

            {/* button to trigger adding a new event */}
            <Button onClick={(e) => setShowForm(true)}>
                Add Event
            </Button>

            {/* Calendar component */}
            <Calendar
                onChange={setDate}
                value={date}
                tileContent={({ date, view }) => {
                    // Format date to YYYY-MM-DD to compare
                    const dateStr = date.toISOString().split("T")[0];
                    const event = events.find(event => event.date.toISOString().split("T")[0] === dateStr);

                    // ff event exists, return a styled div
                    return event ? (
                        <div style={{
                            backgroundColor: "red",
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            margin: "auto"
                        }}>
                            {/*{event.name}*/}
                        </div>
                    ) : null;
                }}
            />

            { showForm && (
                <div className={"NewEventForm"}>
                    <h3>New Event</h3>
                    <form onSubmit={(e) => {e.preventDefault(); createNewEvent(eventName, eventDate);
                    }}>
                        <input
                            type="text"
                            placeholder="Event Name"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                        />
                        <input
                            type="date"
                            placeholder="When is the Event?"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                        />
                        <Button onClick={(e) => createNewEvent(eventName, eventDate)}>
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
