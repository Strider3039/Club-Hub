import React, {useState} from "react";
import {useNavigate} from "react-router-dom";


function RegisterClub(){

    const navigate = useNavigate();
    const [clubName, setClubName] = useState("");
    const [description, setDescription] = useState("");
    const [members, setMembers] = useState([]); // will have to pull the current user that is logged in and add the user to the list

    const handleRegister = async (e) => {
        e.preventDefault();
        // data base shit dont worry about rn
        navigate("/");
    }

    return(
        <div className="ClubRegister">
            <h1>Register Club</h1>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Club Name" value={clubName} onChange={(e) => setClubName(e.target.value)} />
                <unput type={"text"} placeholder={"Give your club a description!"} value={description} onChange={(e) => setDescription(e.target.value)} />
                <button type="submit">Register</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    );
}

export default RegisterClub;