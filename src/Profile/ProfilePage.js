import Layout from './Layout/Layout';
import ProfileCard from './ProfileCard/ProfileCard';
import NavBar from "./NavBar/NavBar";
import jerma from './assets/profilePic.png'
import FriendsList from './Profile/Friends/FriendsList';

function ProfilePage() {

    //this is for testing purposes. the DATABASE will have to be linked here
    const friendList = [
        {name: "jerma1", pfp: jerma},
        {name: "jerma2", pfp: jerma},
        {name: "jerma3", pfp: jerma},
        {name: "jerma4", pfp: jerma},
        {name: "jerma5", pfp: jerma},
        {name: "jerma6", pfp: jerma},
        {name: "jerma7", pfp: jerma},
        {name: "jerma8", pfp: jerma},
    ]

    return(
        <>
            <NavBar/>
            <Layout
                  leftContentHeader={"Current Clubs"}
                  middleContentHeader={""}
                  rightContentHeader={"Friends"}

                  leftContentBody={"Nothing to see here!"}
                  middleContentBody={<ProfileCard userProfilePic={jerma}/>}
                  rightContentBody=<FriendsList friends={friendList}/>
            />
        </>
    );
}


export default ProfilePage;