import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./store/counterSlice";

function App() {
const count = useSelector((state) => state.counter.value);
const dispatch = useDispatch();
const buttonyle = {
    
}
return (
<div>
<h1>Compteur : {count}</h1>
<button onClick={() => dispatch(increment())} style={{backgroundColor:"greenyellow",width:"40px",height:"40px"}}>+</button>
<button onClick={() => dispatch(decrement())}>-</button>
</div>
);
}

export default App;
