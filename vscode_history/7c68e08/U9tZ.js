import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Years from "./screen/Years.js";
import Filieres from "./screen/Filiers.js";
import FiliereDetail from "./screen/FilieresDetail.js";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Years />} />
        <Route path="/filieres/:yearId" element={<Filieres />} />
        <Route path="/filiere/:id" element={<FiliereDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
