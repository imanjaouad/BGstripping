import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import "./style/LoginPage.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/operations/poussage" element={<AdminDashboard />} />
      <Route path="/operations/encasement" element={<div style={{ padding: 24 }}>Page Encasement en cours...</div>} />
      <Route path="/operations/casement" element={<Navigate to="/operations/encasement" replace />} />
      <Route path="/operations/cumenage" element={<Navigate to="/operations/encasement" replace />} />
      <Route path="/operations/transport" element={<div style={{ padding: 24 }}>Page Transport en cours...</div>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
export default App;


