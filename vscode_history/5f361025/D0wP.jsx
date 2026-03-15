import { useState } from "react";
import styled from "styled-components";


const Input = styled.textarea`
border : 2px solid blue;
border-radius : 13px;
width : 600px;
height: 30px;
`

const TextArea = (props) =>{
    const [message,setMessage] = useState("");
    const handleChange = (e) =>{
        setMessage(e.target.value)
    }
    const handleFocus = () =>{
        setMessage("");
    }
    return(
        <Input cols={props.cols} rows={props.rows} value={props.value} onFocus={handleFocus} onChange={handleChange} > 
        
        </Input>
    );
};

export default TextArea;