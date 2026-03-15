import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Importation du middleware
import postReducer from './reducer';

// On crée le store en lui appliquant le middleware thunk
const store = createStore(postReducer, applyMiddleware(thunk));

export default store;