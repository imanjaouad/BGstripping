import React, { use, useState } from "react";

export default function App(){
  const [profile,setProfile] =useState("")

  const [formation,setFormation]=useState([])


  const formations = [
    {nom:"bac"},{nom:"licence"},{nom:"offpt"}
  ];

  function onSubmitProfile {
    setProfile(profile)
  }
  function onSubmitFormation {
    setFormation(formation)
    {
      formations.map((e,i)=><input type="text" key={i}> {e.name}</input>)
    }
  }


  return(
    <>
        <br/>
      <input type="text"></input>
        <br/>
      <input type="text"></input>
    </>
  )




}