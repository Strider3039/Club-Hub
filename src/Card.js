

function Card(props) {
    return (
        <div style={{
            border: "1px solid hsl(0, 0%, 80%)",
            borderRadius: "10px",
            boxShadow: "5px 5px 5px hsla(0, 0%, 0%, 0.1)",
            paddingRight: "0px",
            margin: "10px",
            textAlign: "center",
            width: "100%",
            display: "inline-block"
        }}>
            {props.children}
        </div>
    );
}

export default Card;
