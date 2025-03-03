import Club from './ClubItem';
import './ClubsList.css'

//this function accepts a list of club objects
function ClubsList(props) {

    const itemList = props.clubs;
    const list = itemList.map(club => <li key={club.name}><Club clubLogo={club.logo} clubName={club.name} /></li>);

    return (
        <>
            <h1>Clubs</h1>
            <hr style={{ border: '0', borderTop: '1px solid #ccc', margin: '20px 0' }}></hr>
            <div className={"club-list"}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {list}
                </ul>
            </div>
        </>
    );
}

export default ClubsList;