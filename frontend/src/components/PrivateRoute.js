import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedMode }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    // pas connecté → redirect login
    return <Navigate to="/login" replace />;
  }

  // admin peut accéder partout
  if (user.role === "admin") {
    return children;
  }

  // utilisateur normal : vérifie le mode
  if (allowedMode && user.mode_operation !== allowedMode) {
    alert("❌ Vous n'avez pas le droit d'accéder à cette page !");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;