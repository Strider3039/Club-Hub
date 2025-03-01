import React from "react";
import NavBar from "./NavBar/NavBar";
import Layout from "./Layout/Layout";

function Home(){
    return (
        <body>
            <NavBar/>
            <Layout
                leftContentHeader={"Left Content"}
                leftContentBody={<p>left test</p>}

                middleContentHeader={"Middle Content"}
                middleContentBody={<p>middle test</p>}

                rightContentHeader={"Right Content"}
                rightContentBody={<p>right test</p>}
            />
        </body>
    )
}

export default Home;
