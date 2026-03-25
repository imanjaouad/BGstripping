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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // ✅ error state

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(""); // ✅ reset error

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        username: formData.username,
        password: formData.password
      });

      const user = res.data.user;

      // ✅ stockage
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(user));

      if (formData.remember) {
        localStorage.setItem("token", res.data.token);
      }

      // ✅ redirection
      setTimeout(() => {
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
      }, 300);

    } catch (error) {
      // ✅ message UX propre
      setErrorMsg("Nom d'utilisateur ou mot de passe incorrect");
      setLoading(false);
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

         

          <form onSubmit={handleLogin}>

            {/* USERNAME */}
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur:</label>
              <div className="input-box">
                <FaUser className="icon" />
                <input
                  id="username"
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label htmlFor="password">Mot de passe:</label>
              <div className="input-box">
                <FaLock className="icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={loading}
                />
                <span
                  className="toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* OPTIONS */}
            <div className="options">
              <label>
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) =>
                    setFormData({ ...formData, remember: e.target.checked })
                  }
                  disabled={loading}
                />
                Se souvenir de moi
              </label>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className={`login-btn ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : "Se Connecter"}
            </button>
            {/* ✅ ERROR تحت */}
{errorMsg && <div className="error-msg">{errorMsg}</div>}

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}