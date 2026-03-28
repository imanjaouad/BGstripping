import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Poussage from "./pages/Poussage/poussage";
import Casement from "./pages/Casement/casement";
import TransportDashboard from "./pages/Transport/TransportDashboard";
import TransportStatistiques from "./pages/Transport/TransportStatistiques";
import "./style/PoussageForm.css";
import "./style/ReportsSection.css";
import Securite from "./pages/Home/Securite";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
     
    <Route path="/login" element={<Login />} />
      <Route path="/securite" element={<Securite />} />
    

      {/* Poussage — wildcard /* required for nested <Routes> in poussage.js */}
      <Route path="/poussage/*" element={<Poussage />} />
      <Route path="/operations/poussage/*" element={<Poussage />} />

      {/* Casement — wildcard /* required for nested <Routes> in casement.js */}
      <Route path="/casement/*" element={<Casement />} />
      <Route path="/operations/casement/*" element={<Casement />} />

      {/* Transport */}
      <Route path="/transport" element={<TransportDashboard />} />
      <Route path="/transport/statistiques" element={<TransportStatistiques />} />
      <Route path="/operations/transport" element={<TransportDashboard />} />
    </Routes>
  );
}

export default App;