import React,{useState} from "react";
import User from "./User";
export default function ListUser(props){

    const[activatedId,setActivreId]=useState(1)
const users=props.utilisateurs
function handleChangeActivatedId(id){
    setActivreId(id)
    
}
}
