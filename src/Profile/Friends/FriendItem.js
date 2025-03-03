
// import { useHistory } from 'react-router-dom'; // assuming you're using React Router
import './FriendItem.css'

function FriendItem(props) {

    const handleClick = () => {
        // go to friend profile
    };

    return (
        <button onClick={handleClick} className="friend-item">
            <img className="friend-pfp" src={props.friendPfp} alt={`${props.friendName}'s profile`} />
            <h2>{props.friendName}</h2>
        </button>
    );
}

export default FriendItem;