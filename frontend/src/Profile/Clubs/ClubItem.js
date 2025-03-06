import './ClubItem.css'

function ClubItem(props) {

    const handleClick = () => {
        // go to club homepage
    };

    return (
        <button onClick={handleClick} className="club-item">
            <img className="club-pfp" src={props.clubLogo} alt={`${props.clubName}'s club page`} />
            <h2>{props.clubName}</h2>
        </button>
    );
}

export default ClubItem;