import React from "react";
import "./Layout.css";
import App from "../App";

function Layout(props) {
    return (

        //props:
        //
        //leftContentHeader
        //middleContentHeader
        //rightContentHeader
        //
        //leftContentBody
        //middleContentBody
        //rightContentBody


        <div className={"Layout"}>
            <div className={"content-left"}>
                <h2>{props.leftContentHeader}</h2>
                    <content>
                        {props.leftContentBody}
                    </content>
            </div>
            <div className={"content-middle"}>
                <h2>{props.middleContentHeader}</h2>
                <content>
                    {props.middleContentBody}
                </content>
            </div>
            <div className={"content-right"}>
                <h2>{props.rightContentHeader}</h2>
                <content>
                    {props.rightContentBody}
                </content>
            </div>
        </div>
    )
}

export default Layout;