import React, { use, useState } from "react";


export default function App(){
  const [profile,setProfile] =useState("")

  const [formation,setFormation]=useState([])


  const formation = [
    {nom:"bac"},{nom:"licence"},{nom:"offpt"}
  ];

  function onSubmitProfile {
    
  }

  return(
    <>
     <input type="text"></input>
        <br/>
      <input type="text"></input>
        <br/>
      <input type="text"></input>
    </>
  )




}