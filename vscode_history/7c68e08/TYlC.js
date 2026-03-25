import { BrowserRouter, Routes, Route } from "react-router-dom";
import Years from "./";
import Filieres from "./screens/Filieres";

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
