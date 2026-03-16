import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Years from "./screens/Years";
import Filieres from "./screens/Filieres";
import FiliereDetail from "./screens/FiliereDetail";

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
