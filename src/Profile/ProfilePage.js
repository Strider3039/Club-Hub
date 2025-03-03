import Layout from '../Layout/Layout';
import ProfileCard from '../ProfileCard/ProfileCard';
import NavBar from "../NavBar/NavBar";
import jerma from '../assets/profilePic.png'
import Logo from '../assets/clubLogo.png'
import pfp from '../assets/noProfilePhoto.jpg'
import FriendsList from './Friends/FriendsList';
import ClubsList from './Clubs/ClubsList';
import EventList from "./Clubs/EventList";

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
        {name: "jerma9", pfp: jerma},
        {name: "jerma10", pfp: jerma},
        {name: "jerma11", pfp: jerma},
        {name: "jerma12", pfp: jerma},
        {name: "jerma13", pfp: jerma},
        {name: "jerma14", pfp: jerma},
        {name: "jerma15", pfp: jerma},
        {name: "jerma16", pfp: jerma},
        {name: "jerma17", pfp: jerma},
    ]

    const clubList = [
        {name: "club1", logo: Logo},
        {name: "club2", logo: Logo},
        {name: "club3", logo: Logo},
        {name: "club4", logo: Logo},
        {name: "club5", logo: Logo},
        {name: "club6", logo: Logo},
    ]

    const eventList = [
        {name: "event1", day: "3/3/25", time: "4:00pm"},
        {name: "event2", day: "3/3/25", time: "4:00pm"},
        {name: "event3", day: "3/3/25", time: "4:00pm"},
        {name: "event4", day: "3/3/25", time: "4:00pm"},
        {name: "event5", day: "3/3/25", time: "4:00pm"},
        {name: "event6", day: "3/3/25", time: "4:00pm"},
        {name: "event7", day: "3/3/25", time: "4:00pm"},
    ]

    return(
        <>
            <NavBar page={"Profile"}/>
            <Layout
                  leftContentHeader={"Current Clubs"}
                  middleContentHeader={""}
                  rightContentHeader={"Friends"}

                  leftContentBody={
                    <>
                        <ClubsList clubs={clubList}/>
                        <EventList events={eventList}/>
                    </>
                  }

                  middleContentBody={<ProfileCard userProfilePic={pfp}/>}
                  rightContentBody=<FriendsList friends={friendList}/>
            />
        </>
    );
}


export default ProfilePage;