import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Poussage from "./pages/Poussage/poussage";
import Casement from "./pages/Casement/casement";

import "./style/PoussageForm.css";
import "./style/ReportsSection.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Poussage */}
      <Route path="/poussage/*" element={<Poussage />} />

      {/* Casement */}
      <Route path="/operations/casement/*" element={<Casement />} />

      {/* Transport */}
      <Route
        path="/operations/transport"
        element={<div style={{ padding: 24 }}>Page Transport en cours...</div>}
      />  </Routes>
  
  );
}

export default App;