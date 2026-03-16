import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Years from "./screen/Yearrs";
import Filieres from "./screen/Filierees";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Years />} />
        <Route path="/filieres/:yearId" element={<Filieres />} />
      </Routes>
    </Router>
  );
}

export default App;
