import './ProfileCard.css'

function ProfileCard(props){
    return(
      <div className="card">
          <img className="card-image" src={props.userProfilePic} alt="profile picture"></img>
          <h2 className="card-title"> {props.userName}</h2>
          <p className="card-text"> {props.userBio}</p>
      </div>
    );
}

export default ProfileCard;