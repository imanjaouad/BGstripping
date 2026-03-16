import { BrowserRouter, Routes, Route } from "react-router-dom";
import Years from "./screens/years.jsx";
import Filieres from "./screens/Filiers.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/years" element={<Years />} />
        <Route path="/filiere/:yearID" element={<Filieres />} />
      </Routes>
    </BrowserRouter>
  );
}
