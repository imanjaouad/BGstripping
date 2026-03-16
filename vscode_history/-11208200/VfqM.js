import React,{useState} from "react";
import axios from "axios";


export default function WeatherApp(){
   
 const [city,setCity]= useState("");
 const [weather,setWeather]=useState(null);
 const [error,setEror]=useState(null);

 const getWeather = async ()=>{
    if (!city)
    return 

    const geos = await axios.get
 }


}