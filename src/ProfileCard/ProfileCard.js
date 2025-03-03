import './ProfileCard.css'
import photo from '../assets/profilePic.png';



function ProfileCard(
    props,
    userName="Anonymous",
    userBio="no bio yet"
) {


    return (
        <div className="card">
            <img className="card-image" src={props.userProfilePic} alt="profile picture"></img>
            <h2 className="card-title">{userName}</h2>
            <p className="card-text">{userBio}</p>
        </div>
    );
}

export default ProfileCard;