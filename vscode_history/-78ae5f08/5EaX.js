import React from "react";
import film from "./images/imagefilm.jpeg"

const Card = (props) => {
    return(
        <div className="content">
            <img className="image" alt="image" src={film} />
            <p>{props.title}</p>
            <button></button>
        </div>
    )
}
export default Card;


