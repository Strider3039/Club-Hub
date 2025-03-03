import './EventItem.css'

function EventItem(props) {

    const handleClick = () => {
        // go to homepage of club using something like props.clubId
    };


    return (
        <button onClick={handleClick} className="event-item">
            {/*<h2>{props.eventName}</h2>*/}
            <h2>{`${props.eventName} | ${props.eventDay} at ${props.eventTime}`}</h2>
        </button>
    );
}

export default EventItem;