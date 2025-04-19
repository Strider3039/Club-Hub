import React from "react";
import Layout from "./Layout/Layout";
import GenLayout from "./Layout/GeneralLayout";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate(); // Hook to navigate to different pages

    return (
        <div>
            <GenLayout pageTitle={"Home"}>
                <Layout
                    leftContentHeader={"Left Content"}
                    leftContentBody={<p>left test</p>}
                    middleContentHeader={"Middle Content"}
                    middleContentBody={<p>middle test</p>}
                    rightContentHeader={"Right Content"}
                    rightContentBody={<p>right test</p>}
                />
            </GenLayout>
        </div>
    );
}

export default Home;
