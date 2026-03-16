import { BrowserRouter, Routes, Route } from "react-router-dom";
import Years from "./pages/Years";
import Filieres from "./pages/Filieres";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* يعرض جميع السنوات */}
        <Route path="/years" element={<Years />} />

        {/* يعرض filieres ديال سنة معينة */}
        <Route path="/filiere/:yearID" element={<Filieres />} />

      </Routes>
    </BrowserRouter>
  );
}
