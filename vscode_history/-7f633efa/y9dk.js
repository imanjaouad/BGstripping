import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createStore } from "redux"
import reducer from "./store/reducer"
const store = createStore(reducer)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

