import Friend from './FriendItem';
import jerma from '../assets/profilePic.png'

//this function accepts a list of friend objects
function FriendsList(props) {

    const itemList = props.friends;

    const list = itemList.map(friend => <li key={friend.name}><Friend friendPfp={friend.pfp} friendName={friend.name} /></li>);

    return (
        <>
            <h1>Friends</h1>
            <hr style={{ border: '0', borderTop: '1px solid #ccc', margin: '20px 0' }}></hr>
            <ul style={{listStyle: 'none'}}>{list}</ul>

        </>
    );
}

export default FriendsList;