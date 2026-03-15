import { useState } from "react";

const TextArea = (props) =>{
    const [message,setMessage] = useState("");
    const handleChange = (e) =>{
        setMessage(e.target.value)
    }
    const handleFocu = () =>{
            setMessage("");
    }
    return(
        <textarea> cols={props.cols}</textarea>
    )
}