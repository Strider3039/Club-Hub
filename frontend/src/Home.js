import React from "react";
import NavBar from "./NavBar/NavBar";
import Layout from "./Layout/Layout";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate(); // Hook to navigate to different pages

    return (
        <div>
            <NavBar page={"Home"}/>
            <Layout
                leftContentHeader={"Left Content"}
                leftContentBody={<p>left test</p>}

                middleContentHeader={"Middle Content"}
                middleContentBody={<p>middle test</p>}

                rightContentHeader={"Right Content"}
                rightContentBody={<p>right test</p>}
            />
        </div>
    );
}

export default Home;
