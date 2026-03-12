import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import DashboardComplet from "./pages/Poussage/Dashboardcomplet";
import Poussage from "./pages/Poussage/poussage";
import Casement from "./pages/Casement/casement";
import Dashboard from "./pages/Poussage/Dashboard";
import Statistique from "./pages/Poussage/Statistique";
import Historique from "./pages/Poussage/Historique";
import Cout from "./pages/Poussage/Cout";
import "./style/PoussageForm.css";
import "./style/ReportsSection.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Poussage */}
      <Route path="/poussage" element={<Poussage />} />
      <Route path="/operations/poussage" element={<Poussage />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/DashboardComplet" element={<DashboardComplet />} />
      <Route path="/statistique" element={<Statistique />} />
      <Route path="/historique" element={<Historique />} />
      <Route path="/Cout" element={<Cout />} />

      {/* 
        Casement — wildcard /* is REQUIRED so that nested <Routes> inside
        Casement.js can match sub-paths like /operations/casement/statistique 
      */}
      <Route path="/operations/casement/*" element={<Casement />} />

      {/* Transport placeholder */}
      <Route
        path="/operations/transport"
        element={<div style={{ padding: 24 }}>Page Transport en cours...</div>}
      />
    </Routes>
  );
}

export default App;