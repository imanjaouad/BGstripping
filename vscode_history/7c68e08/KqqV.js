import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Years from "./screen/Years";
import Filieres from "./screen/Filieres";
import FiliereDetail from "./FiliereDetail";

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
