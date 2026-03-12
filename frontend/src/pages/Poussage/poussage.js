import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Dashboard from "../../pages/Poussage/Dashboard";
import Statistique from "../../pages/Poussage/Statistique";
import Historique from "../../pages/Poussage/Historique";
import Cout from "../../pages/Poussage/Cout";
import "../../components/animations.css";
import DashboardComplet from "../../pages/Poussage/Dashboardcomplet";

function Poussage() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/DashboardComplet" element={<DashboardComplet />} />

          <Route path="/statistique" element={<Statistique />} />

          <Route path="/historique" element={<Historique />} />
          <Route path="/Cout" element={<Cout />} />
        </Routes>
      </div>
    </div>
  );
}

export default Poussage;
