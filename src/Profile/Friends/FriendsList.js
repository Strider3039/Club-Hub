import Friend from './FriendItem';
import './FriendsList.css'

//this function accepts a list of friend objects
function FriendsList(props) {

    const itemList = props.friends;

    const list = itemList.map(friend => <li key={friend.name}><Friend friendPfp={friend.pfp} friendName={friend.name} /></li>);

    return (
        <>
            <h1>Friends</h1>
            <hr style={{ border: '0', borderTop: '1px solid #ccc', margin: '20px 0' }}></hr>
            <div className={"scrollable-list"}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {list}
                </ul>
            </div>
        </>
    );
}

export default FriendsList;