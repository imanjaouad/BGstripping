import { Routes, Route, Link } from "react-router-dom";
import Users from "./screens/Users";
import Posts from "./screens/Posts";
import Home from "./screens/Home";
import About from "./screens/About";
import Contact from "./screens/Contact";

function App() {
  return (
    <div>
      <nav>
        <Link to="/users">Users</Link> |{" "}
        <Link to="/posts">Posts</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Routes supplémentaires */}
        <Route path="/users" element={<Users />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </div>
  );
}

export default App;
