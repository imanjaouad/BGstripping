import React from "react";
import film from "./images/imagefilm.jpeg"

const Card = () => {
    return(
        <div className="content">
            <img className="image" alt="image" src={film}/>
            <p> Film  title</p>
        </div>
    )
}
export default Card;


