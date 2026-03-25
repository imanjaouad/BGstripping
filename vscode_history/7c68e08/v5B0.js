import { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./screens/home";
import About from "./screens/about";
import Contact from "./screens/contact";

class App extends Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/11">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

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
