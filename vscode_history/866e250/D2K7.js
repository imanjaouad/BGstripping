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
  if (action.type === "playPause") {
    if (state.winner) {
      return state;
    }
    return { ...state, playing: !state.playing };
  }
  if (action.type === "pointScored") {
    const player = action.payload.player;
    const otherPlayer = player === "player1" ? "player2" : "player1";

    if (state.winner || state.playing === false) return state;

    const currentPlayerScore = state[player];

    if (currentPlayerScore <= 15) return { ...state, [player]: currentPlayerScore + 15 };
    if (currentPlayerScore === 30) return { ...state, [player]: 40 };

    if (currentPlayerScore === 40) {
      if (state[otherPlayer] !== 40 || state.advantage === player) {
        return { ...state, winner: player };
      }
      if (state.advantage === null) return { ...state, advantage: player };
      return { ...state, advantage: null };
    }
  }
  return state;
}

// Création du store avec Redux DevTools activé
export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
