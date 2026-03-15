// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
// App.js
import Years from "./src/components/Years";
import Filieres from "./src/components/Filieres";


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
