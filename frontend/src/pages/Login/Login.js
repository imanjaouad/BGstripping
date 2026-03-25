import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/Login.css";

import Navbar from "../Home/navBare";
import Header from "../Home/Header";
import Footer from "../Home/Footer";

import { FaUser, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import logo from "../../images/logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        username: formData.username,
        password: formData.password
      });

      const user = res.data.user;

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(user));

      if (formData.remember) {
        localStorage.setItem("token", res.data.token);
      }

      if (user.role === "admin") {
        navigate("/admin/users");
      } else {
        switch (user.mode_operation) {
          case "poussage":
            navigate("/operations/poussage/dashboard");
            break;
          case "casement":
            navigate("/operations/casement/dashboard");
            break;
          case "transport":
            navigate("/operations/transport/dashboard");
            break;
          default:
            navigate("/");
        }
      }

    } catch (error) {
      console.log(error.response?.data);
      alert("Login incorrect");
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <Header />

      <main className="login-container">

        <div className="login-card">

          {/* LOGO */}
          <div className="logo-top">
            <img src={logo} alt="logo" />
          </div>

          <h2>Se Connecter</h2>
          <p className="subtitle">Accédez à votre espace BG Stripping</p>

          <form onSubmit={handleLogin}>

            <div className="input-box">
              <FaUser className="icon" />
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>

            <div className="input-box">
              <FaLock className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <span
                className="toggle-pass"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="options">
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setFormData({ ...formData, remember: e.target.checked })
                  }
                />
                Se souvenir de moi
              </label>
            </div>

            <button type="submit" className="login-btn">Se Connecter</button>

          </form>

          <div className="footer-text">
            OCP Group | BGstripping Service
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}