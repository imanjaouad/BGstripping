
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Statistique from "./pages/Statistique";
import Historique from "./pages/Historique";
import Rapport from "./pages/Rapport";

function App() {
  return (
    <Router>

      <div className="container-fluid">
        <div className="row">

          <Sidebar />

          <div className="col-md-10 p-4">

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/statistique" element={<Statistique />} />
              <Route path="/historique" element={<Historique />} />
              <Route path="/rapport" element={<Rapport />} />
            </Routes>

          </div>

        </div>
      </div>

    </Router>

  )
}

export default App;