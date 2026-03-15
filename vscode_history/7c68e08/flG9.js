import { Routes, Route, Link } from "react-router-dom";
import Users from "./screens/Users";
import Posts from "./screens/Posts";

function App() {
  return (
    <div>
      <nav>
        <Link to="/users">Users</Link>
        <Link to="/posts">Posts</Link>
      </nav>

      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </div>
  );
}

export default App;
