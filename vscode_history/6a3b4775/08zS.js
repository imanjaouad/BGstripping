import React from "react";
import { connect } from "react-redux";
import { increment,decrement } from "./redux/actions";

function Counter ({count,increment,decrement}){
  return(
    <div>
      <h1>COUNTER :</h1>
      <h2>{count}</h2>

      <div>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>

      </div>
    </div>
  )
}

const mapStateToProps = (state) =>({
  count : state.count

})

constDispatchToProps = {
  increment,decrement
}

export default connect(mapStateToProps,mapDispatchToProps)(Counter);