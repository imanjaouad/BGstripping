import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";

// Dashboards
import Poussage from "./pages/Poussage/poussage";
import Casement from "./pages/Casement/casement";
import TransportDashboard from "./pages/Transport/TransportDashboard";
import TransportStatistiques from "./pages/Transport/TransportStatistiques";

// Admin
import UserManagement from "./pages/UsersManagement/UserManagement";

// Protection
import PrivateRoute from "./components/PrivateRoute";

// Styles
import "./style/PoussageForm.css";
import "./style/ReportsSection.css";
import Securite from "./pages/Home/Securite";

function App() {
  return (

    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/securite" element={<Securite />} />
    


      {/* ADMIN */}
      <Route
        path="/admin/users"
        element={
          <PrivateRoute>
            <UserManagement />
          </PrivateRoute>
        }
      />

      {/* POUSSAGE */}
      <Route
        path="/poussage/*"
        element={
          <PrivateRoute allowedMode='poussage'>
            <Poussage />
          </PrivateRoute>
        }
      />

      <Route
        path="/operations/poussage/*"
        element={
          <PrivateRoute allowedMode='poussage'>
            <Poussage />
          </PrivateRoute>
        }
      />

      {/* CASEMENT */}
      <Route
        path="/casement/*"
        element={
          <PrivateRoute allowedMode='casement'>
            <Casement />
          </PrivateRoute>
        }
      />

      <Route
        path="/operations/casement/*"
        element={
          <PrivateRoute allowedMode='casement'>
            <Casement />
          </PrivateRoute>
        }
      />

      {/* TRANSPORT */}
      <Route
        path="/transport"
        element={
          <PrivateRoute allowedMode='transport'>
            <TransportDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/transport/statistiques"
        element={
          <PrivateRoute allowedMode='transport'>
            <TransportStatistiques />
          </PrivateRoute>
        }
      />

      <Route
        path="/operations/transport"
        element={
          <PrivateRoute allowedMode='transport'>
            <TransportDashboard />
          </PrivateRoute>
        }
      />

    </Routes>

  );
}

export default App;