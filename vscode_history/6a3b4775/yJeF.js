import React from "react";
import { connect } from "react-redux";
import { increment,decrement } from "./redux/actions";

function Counter ({count,increment,decrement}){
  return(
    <div>
      <h1>COUNTER :</h1>
      <h2>{count}</h2>

      <div>
        
      </div>
    </div>
  )
}