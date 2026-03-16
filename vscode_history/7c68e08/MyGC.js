import { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Users from "./screens/Users";
import Posts from "./screens/Posts";
class App extends Component {
  render() {
    return (
      <div>
       
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

    );
  }
}

export default App;
