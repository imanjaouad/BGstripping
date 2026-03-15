import { useDispatch } from "react-redux";
import { pointScored } from "./redux/store";
export function PointScoredButton({ playerId, children }) {
const dispatch = useDispatch();
return (
<button
className="button"
onClick={() => { dispatch(pointScored(playerId)); }}
> {children}
</button>
);
}