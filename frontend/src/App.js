import { Routes, Route } from "react-router-dom";

// Pages publiques
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Securite from "./pages/Home/Securite";

// Dashboards (modules)
import Poussage from "./pages/Poussage/poussage";
import Casement from "./pages/Casement/casement";
import TransportDashboard from "./pages/Transport/TransportDashboard";
import TransportStatistiques from "./pages/Transport/TransportStatistiques";

// Admin
import UserManagement from "./pages/UsersManagement/UserManagement";

// Protection des routes
import PrivateRoute from "./components/PrivateRoute";

// Styles globaux
import "./style/PoussageForm.css";
import "./style/ReportsSection.css";

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      {/* Page d'accueil */}
      <Route path="/" element={<Home />} />

      {/* Page de connexion */}
      <Route path="/login" element={<Login />} />

      {/* Page sécurité */}
      <Route path="/securite" element={<Securite />} />


      {/* ================= ADMIN ================= */}

      {/* Gestion des utilisateurs (accessible seulement si connecté) */}
      <Route
        path="/admin/users"
        element={
          <PrivateRoute>
            <UserManagement />
          </PrivateRoute>
        }
      />


      {/* ================= POUSSAGE ================= */}

      {/* Route principale poussage */}
      <Route
        path="/poussage/*"
        element={
          // allowedMode = vérifier rôle (poussage)
          <PrivateRoute allowedMode='poussage'>
            <Poussage />
          </PrivateRoute>
        }
      />

      {/* Même module mais autre chemin */}
      <Route
        path="/operations/poussage/*"
        element={
          <PrivateRoute allowedMode='poussage'>
            <Poussage />
          </PrivateRoute>
        }
      />


      {/* ================= CASEMENT ================= */}

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


      {/* ================= TRANSPORT ================= */}

      {/* Dashboard transport */}
      <Route
        path="/transport"
        element={
          <PrivateRoute allowedMode='transport'>
            <TransportDashboard />
          </PrivateRoute>
        }
      />

      {/* Statistiques transport */}
      <Route
        path="/transport/statistiques"
        element={
          <PrivateRoute allowedMode='transport'>
            <TransportStatistiques />
          </PrivateRoute>
        }
      />

      {/* Autre accès transport */}
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