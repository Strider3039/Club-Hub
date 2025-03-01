import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/Login";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;

// TESTING CARD
// import ProfileCard from './ProfileCard/ProfileCard';
// import profilePic from './assets/profilePic.png'
//
// function App() {
//     return(
//       <ProfileCard userProfilePic={profilePic} userName="Jerma" userBio={"im jerma and im a weirdo in this picture but i look funny"}></ProfileCard>
//     );
// }
// export default App;