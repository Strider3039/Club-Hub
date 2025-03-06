import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/Login";
import SignUp from "./SignUp/SignUp";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="./SignUp/SignUp" element={<SignUp />} />
            </Routes>
        </Router>
    );
}

export default App;

//TESTING CARD
// import ProfileCard from './ProfileCard/ProfileCard';
// import profilePic from './assets/profilePic.png'
// import ProfilePage from './Profile/ProfilePage.js';
//
// function App() {
//     return(
//         <ProfilePage/>
//     );
// }
// export default App;