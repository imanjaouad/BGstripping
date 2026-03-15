import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./store/counterSlice";

function App() {
const count = useSelector((state) => state.counter.value);
const dispatch = useDispatch();
const buttonyle = {
    backgroundColor:"blue",width:"40px",height:"40px"
}
return (
<div>
<h1 style={{color:"blue"}}>Compteur : {count}</h1>
<button onClick={() => dispatch(increment())} style={buttonyle}>+</button>
<button onClick={() => dispatch(decrement())} style={buttonyle}>-</button>
</div>
);
}

export default App;
