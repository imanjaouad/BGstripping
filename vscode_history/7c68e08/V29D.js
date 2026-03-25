import { BrowserRouter, Routes, Route } from "react-router-dom";
import Years from "./components/Filieres";
import Filieres from "./screens/components";

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
