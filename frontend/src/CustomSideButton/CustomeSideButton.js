import './CustomSideButton.css';
import {useState} from "react";

function CustomSideButton(props) {

    // props:
    // text
    // style
    // buttons
    // placement
    // onclick
    //

    const [isHover, setHover] = useState(false);

    if (props.style === "popover")
    {
        return (
            <div
                className="popover-trigger-wrapper"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <button className="sideBarButton">
                    {props.text}
                </button>

                {isHover && (
                    <div
                        className="popover"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "100%",
                            zIndex: 1000,
                            padding: "6px",
                            marginLeft: "6px",
                        }}
                    >
                        {props.buttons?.map((btn, index) => (
                            <CustomSideButton
                                key={index}
                                text={btn.text}
                                onClick={btn.onClick}
                                style={btn.style}
                                buttons={btn.buttons}
                                placement={btn.placement}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }
    else
    {
        return (
            <button className="sideBarButton"
                    onClick={props.onClick}
            >
                {props.text}
            </button>
        );
    }
}

export default CustomSideButton;


