import { createStore } from "redux";
// state
const initialState = {
player1: 0,
player2: 0,
advantage: null,
winner: null,
playing: true,
};
// actions creators
export const playPause = () => ({ type: "playPause" });
export const restartGame = () => ({ type: "restart" });
export const pointScored = (player) => ({
type: "pointScored",
payload: { player: player },
});
function reducer(state = initialState, action) {
if (action.type === "restart") {
return initialState;
}