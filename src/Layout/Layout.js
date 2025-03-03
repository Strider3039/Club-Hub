import React from "react";
import "./Layout.css";

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
                {/*<h2>{props.leftContentHeader}</h2>*/}
                    <div>
                        {props.leftContentBody}
                    </div>
            </div>
            <div className={"content-middle"}>
                {/*<h2>{props.middleContentHeader}</h2>*/}
                <div>
                    {props.middleContentBody}
                </div>
            </div>
            <div className={"content-right"}>
                {/*<h2>{props.rightContentHeader}</h2>*/}
                <div>
                    {props.rightContentBody}
                </div>
            </div>
        </div>
    )
}

export default Layout;