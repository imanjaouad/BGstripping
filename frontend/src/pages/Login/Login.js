import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

import "../../style/Login.css";
import logo from "../../images/logo.png";

const modeRoutes = {
  poussage: "/poussage",
  casement: "/operations/casement",
  transport: "/operations/transport",
};

const slides = [
  {
    title: "Optimisation du Décapage",
    desc: "Planification intelligente des zones d'extraction pour maximiser le rendement.",
    icon: "⛏️",
  },
  {
    title: "Gestion du Poussage",
    desc: "Suivi en temps réel des opérations de poussage et coordination des engins.",
    icon: "🚜",
  },
  {
    title: "Casement Intégré",
    desc: "Contrôle précis des volumes et des flux de mise en casement.",
    icon: "📦",
  },
  {
    title: "Transport & Logistique",
    desc: "Optimisation des circuits de transport et traçabilité des convois phosphatiers.",
    icon: "🚛",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    setFormData({
      username: "",
      password: "",
    });
  }, []);

  const particlesInit = async (engine) => await loadFull(engine);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Store auth data
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("user", JSON.stringify(data.user));
          sessionStorage.setItem("token", data.token);
        }

        setFormData({ username: "", password: "" });

        // Redirect to the user's assigned page from the database
        const targetRoute = modeRoutes[data.user.modeOpiration];
        if (targetRoute) {
          navigate(targetRoute);
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Login échoué");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur serveur — vérifiez la connexion.");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="animated-bg"></div>

        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            particles: {
              number: { value: 60 },
              size: { value: 2 },
              move: { speed: 1.2 },
              opacity: { value: 0.5 },
              links: { enable: true, distance: 120, color: "#00ff88", opacity: 0.3, width: 1 },
            },
            interactivity: { events: { onHover: { enable: true, mode: "repulse" } } },
          }}
        />

        <div className="left">
          <div className="presentation-panel">
            <h1>Optimisation du Décapage de Phosphate</h1>
            <p className="subtitle">
              Solution digitale avancée pour la gestion intégrée des flux de production OCP.
            </p>

            <div className="slide-card">
              <div className="slide-icon">{slides[index].icon}</div>
              <h2 className="slide-title">{slides[index].title}</h2>
              <p className="slide-desc">{slides[index].desc}</p>
            </div>

            <div className="dots">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={index === i ? "dot active" : "dot"}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="right">
          <div className="form-box">
            <img src={logo} alt="logo" className="logo" />
            <h2>Connexion</h2>
            <form onSubmit={handleLogin} autoComplete="off">
              <input type="text" name="fakeuser" style={{ display: "none" }} />
              <input type="password" name="fakepassword" style={{ display: "none" }} />

              <div className="input-box">
                <FaEnvelope className="input-icon" />
                <input
                  type="text"
                  name="username"
                  placeholder="Nom d'utilisateur"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-box">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="options-row">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  Se souvenir de moi
                </label>
                <span className="forgot-link">Mot de passe oublié ?</span>
              </div>

              {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 10, textAlign: "center" }}>{error}</p>}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? <span className="loader"></span> : "Se connecter"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}