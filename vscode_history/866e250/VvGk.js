import { createStore } from 'redux';
import counterReducer from './reducer';

// Création du store Redux
const store = createStore(counterReducer);

export default store;