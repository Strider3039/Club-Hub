import React from "react";
import "./Layout.css";
import App from "../App";

function Layout() {
    return (

        <div className={"Layout"}>
            <div className={"content-left"}>
                <h2>Left side</h2>
            </div>
            <div className={"content-middle"}>
                <h2>Middle</h2>
            </div>
            <div className={"content-right"}>
                <h2>Right side</h2>
            </div>
        </div>
    )
}

        // <div className="layout">
        //      <aside className="side left">
        //          <h2>Left Side</h2>
        //          <p>User info that is displayed to the world</p>
        //      </aside>
        //
        //      <main className="main">
        //          <h2>Recommended Stuff</h2>
        //          <p>Events, Posts, maybe users can upload stuff too?.</p>
        //      </main>
        //
        //      <aside className="side right">
        //          <h2>Right Side</h2>
        //          <p>Friends, a calendar maybe with event reminders, discord overlay or integration</p>
        //      </aside>
        //  </div>
//     )
// }

export default Layout;