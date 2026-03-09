import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      { /* <Route path="/login" element={<Login />} /> */}
    </Routes>
  );
}

export default App;