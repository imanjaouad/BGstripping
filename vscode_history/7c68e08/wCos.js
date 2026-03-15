// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Years from "./src/components/years";
import Filieres from "./src/components/filieres";

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
