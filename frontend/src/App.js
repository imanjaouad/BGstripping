import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/operations/encasement"
        element={<div style={{ padding: 24 }}>Page Encasement en cours...</div>}
      />

      <Route
        path="/operations/casement"
        element={<Navigate to="/operations/encasement" replace />}
      />

      <Route
        path="/operations/cumenage"
        element={<Navigate to="/operations/encasement" replace />}
      />

      <Route
        path="/operations/transport"
        element={<div style={{ padding: 24 }}>Page Transport en cours...</div>}
      />

    </Routes>
  );
}

export default App;