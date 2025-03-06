import Event from './EventItem';
import './EventList.css'

//this function accepts a list of club objects
function EventList(props) {

    const itemList = props.events;
    const list = itemList.map(event => <li key={event.name}><Event eventName={event.name} eventDay={event.day} eventTime={event.time} /></li>);

    return (
        <>
            <h1>Events</h1>
            <hr style={{ border: '0', borderTop: '1px solid #ccc', margin: '20px 0' }}></hr>
            <div className={"event-list"}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {list}
                </ul>
            </div>
        </>
    );
}

export default EventList;