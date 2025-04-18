import './CustomSideButton.css';
import {useState} from "react";

function CustomSideButton(props) {

    // props:
    // text
    // style
    // buttons
    // placement
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
                <button className="sideBarButton"
                        style={{
                            backgroundColor: isHover ? "#e0e0e0" : "transparent",
                        }}
                >
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
                            background: "white",
                            padding: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                            marginLeft: "1px",
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
            <button className="sideBarButton">{props.text}</button>
        );
    }
}

export default CustomSideButton;


