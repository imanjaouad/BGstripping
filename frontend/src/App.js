import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Poussage from "./pages/Poussage/poussage";
import Casement from "./pages/Casement/casement";
import TransportDashboard from "./pages/Transport/TransportDashboard";
import TransportStatistiques from "./pages/Transport/TransportStatistiques";
import PrivateRoute from "./components/PrivateRoute";
import "./style/PoussageForm.css";
import UserManagement from "./pages/UsersManagement/UserManagement";
import "./style/ReportsSection.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Poussage — wildcard /* required for nested <Routes> in poussage.js */}
      <Route path="/poussage/*" element={<PrivateRoute><Poussage /></PrivateRoute>} />
      <Route path="/operations/poussage/*" element={<PrivateRoute><Poussage /></PrivateRoute>} />

      {/* Casement — wildcard /* required for nested <Routes> in casement.js */}
      <Route path="/casement/*" element={<PrivateRoute><Casement /></PrivateRoute>} />
      <Route path="/operations/casement/*" element={<PrivateRoute><Casement /></PrivateRoute>} />

      {/* Transport */}
      <Route path="/transport" element={<PrivateRoute><TransportDashboard /></PrivateRoute>} />
      <Route path="/transport/statistiques" element={<PrivateRoute><TransportStatistiques /></PrivateRoute>} />
      <Route path="/operations/transport" element={<PrivateRoute><TransportDashboard /></PrivateRoute>} />
    </Routes>
  );
}

export default App;