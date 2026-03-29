import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import "../../style/Login.css";
import logo from "../../images/logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        username: formData.username,
        password: formData.password,
      });

      const user = res.data.user;

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(user));

      if (formData.remember) {
        localStorage.setItem("token", res.data.token);
      }

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/");
        } else {
          switch (user.mode_operation) {
            case "poussage":
              navigate("/operations/poussage/dashboard");
              break;
            case "casement":
              navigate("/operations/casement/dashboard");
              break;
            case "transport":
              navigate("/operations/transport");
              break;
            default:
              navigate("/");
          }
        }
      }, 300);
    } catch (error) {
      setErrorMsg("Identifiant ou mot de passe incorrect.");
      setLoading(false);
    }
  };

  const features = [
    { icon: "⛏", label: "Poussage & suivi des opérations" },
    { icon: "🏗", label: "Casement structuré et optimisé" },
    { icon: "🚛", label: "Transport et logistique intégrés" },
    { icon: "👥", label: "Gestion avancée des utilisateurs" },
    { icon: "🔒", label: "Sécurité et contrôle d'accès renforcés" },
    { icon: "📄", label: "Rapports détaillés et exportables" },
    { icon: "📊", label: "Statistiques en temps réel" },
  ];

  return (
    <div className="ocp-page">
      <div className="ocp-card">

        {/* LEFT */}
        <div className="ocp-left">
          <div className="ocp-app-title">BG Stripping</div>
          <div className="ocp-divider" />

          <p className="ocp-desc">
            Notre application <strong>BG Stripping</strong> offre une gestion
            complète des opérations industrielles :
          </p>

          <ul className="ocp-features">
            {features.map((f, i) => (
              <li key={i} className="ocp-feature-item">
                <span className="ocp-feature-dot" />
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="ocp-right">

          <div className="ocp-logo-wrap">
            <img src={logo} alt="Logo" className="ocp-logo-img" />
          </div>

          <h2 className="ocp-form-title">Connexion</h2>
          <p className="ocp-form-sub">Accédez à votre espace de travail</p>

          <form onSubmit={handleLogin}>

            {/* USERNAME */}
            <div className="ocp-field">
              <label>Nom d'utilisateur</label>
              <div className="ocp-input-wrap">
                <FaUser className="ocp-fi" />
                <input
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
            <div className="ocp-field">
              <label>Mot de passe</label>
              <div className="ocp-input-wrap">
                <FaLock className="ocp-fi" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={loading}
                />

                <span
                  className="ocp-toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* REMEMBER */}
            <div className="ocp-options">
              <label className="ocp-check-label">
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
              className={`ocp-btn${loading ? " loading" : ""}`}
              disabled={loading}
            >
              {loading ? <span className="ocp-spinner" /> : "Se connecter"}
            </button>

            {errorMsg && <div className="ocp-error">{errorMsg}</div>}
          </form>
        </div>

      </div>
    </div>
  );
}