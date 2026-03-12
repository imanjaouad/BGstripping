import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Dashboard from "../../pages/Poussage/Dashboard";
import Statistique from "../../pages/Poussage/Statistique";
import Historique from "../../pages/Poussage/Historique";
import Cout from "../../pages/Poussage/Cout";
import DashboardComplet from "../../pages/Poussage/Dashboardcomplet";
import PoussageHome from "../../pages/Poussage/PoussageAccueille.js/poussageHome";

function Poussage() {

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={isOpen ? "app-layout open" : "app-layout closed"}>

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className="main-content">

        <Routes>

          <Route index element={<PoussageHome />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Dashboardcomplet" element={<DashboardComplet />} />
          <Route path="Statistique" element={<Statistique />} />
          <Route path="historique" element={<Historique />} />
          <Route path="Cout" element={<Cout />} />

        </Routes>

      </div>

    </div>
  );
}

export default Poussage;