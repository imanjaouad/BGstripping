import React from "react";
import film from "./images/imagefilm.jpeg"

const Card = (props) => {
    const click = ()=>{
        props.click();
    }
    return(
        <div className="content">
            <img className="image" alt="image" src={film} />
            <p>{props.title}</p>
            <button onClick={click}> Click </button>
        </div>
    )
}
export default Card;


