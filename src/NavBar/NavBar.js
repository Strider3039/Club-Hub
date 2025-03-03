// navigation bar component
import React from "react";
import "./NavBar.css";

function NavBar(props) {

    return (
    <nav className="navbar">
        <h1>{props.page}</h1>
        <div className="menu">
            <a href="#">Home</a>  {/* '#' will be replaced with link to next page*/}
            {/*<Link to="/club">Clubs</Link>*/}
            <a href="#">Clubs</a>
            <a href="#">Friends
                <div className="dropdown">
                    <a href={"#"}>My Friends</a>
                    <a href={"#"}>Requests</a>
                    <a href={"#"}>Search</a>
                </div>
            </a>
            <a href="#">Dashboard</a>
        </div>
    </nav>
    )
}

export default NavBar;