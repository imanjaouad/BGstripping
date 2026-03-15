import { useState } from "react";




const TextArea = (props) =>{
    const [message,setMessage] = useState("");
    const handleChange = (e) =>{
        setMessage(e.target.value)
    }
    const handleFocus = () =>{
        setMessage("");
    }
    return(
        <textarea cols={props.cols} rows={props.rows} value={props.value} onFocus={handleFocus} onChange={handleChange}> 
        
        </textarea>
    );
};

export default TextArea;