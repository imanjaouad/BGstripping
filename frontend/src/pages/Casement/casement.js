import React, { useState } from "react";
import "../../components/animations.css";
import AccueilCasement    from "./Accueil_Casement";
import DashboardCasement  from "./Dashboard_Casement";
import SidebarCasement    from "./Sidbare_Casement";
import { Route, Routes }  from "react-router-dom";
import StatistiqueCasement from "./Statistique_Casement";
import HistoriqueCasement  from "./Historique_Casement";
import RapportCasement     from "./Rapport_Casement";
import CoutCasement        from "./Cout_Casement";

/*
  Routes RELATIVES (casement est monté sur /operations/casement/* dans App.js)

  URL complètes obtenues :
    /operations/casement             → AccueilCasement   (page d'accueil)
    /operations/casement/dashboard   → DashboardCasement (saisie)
    /operations/casement/statistique → StatistiqueCasement
    /operations/casement/historique  → HistoriqueCasement
    /operations/casement/rapport     → RapportCasement
    /operations/casement/couts       → CoutCasement
*/

function Casement() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={sidebarOpen ? "app-layout open" : "app-layout closed"}>
      <SidebarCasement
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="main-content">
        <Routes>
          {/* Page d'accueil — /operations/casement */}
          <Route index             element={<AccueilCasement />} />

          {/* Tableau de bord saisie — /operations/casement/dashboard */}
          <Route path="dashboard"  element={<DashboardCasement />} />

          {/* Statistiques — /operations/casement/statistique */}
          <Route path="statistique" element={<StatistiqueCasement />} />

          {/* Historique — /operations/casement/historique */}
          <Route path="historique"  element={<HistoriqueCasement />} />

          {/* Rapport — /operations/casement/rapport */}
          <Route path="rapport"     element={<RapportCasement />} />

          {/* Coûts — /operations/casement/couts */}
          <Route path="couts"       element={<CoutCasement />} />
        </Routes>
      </div>
    </div>
  );
}

export default Casement;