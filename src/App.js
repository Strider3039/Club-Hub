import React from "react";
import "./App.css";

function Home() {
    return (
        <div className="Home">
            {/* Navigation Menu */}
            <nav className="navbar">
                <h1>TODO: Name</h1>
                <div className="menu">
                    <a href="#">Home</a>
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

            {/* Basic Layout */}
            <div className="layout">
                <aside className="side left">
                    <h2>Left Side</h2>
                    <p>User info that is displayed to the world</p>
                </aside>

                <main className="main">
                    <h2>Recommended Stuff</h2>
                    <p>Events, Posts, maybe users can upload stuff too?.</p>
                </main>

                <aside className="side right">
                    <h2>Right Side</h2>
                    <p>Friends, a calendar maybe with event reminders, discord overlay or integration</p>
                </aside>
            </div>
        </div>
    );
}

export default Home;
