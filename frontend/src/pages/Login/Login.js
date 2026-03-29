// Import des hooks React
import { useState } from "react";

// Permet de naviguer entre les pages (React Router)
import { useNavigate } from "react-router-dom";

// Axios pour envoyer des requêtes HTTP vers ton backend (Laravel)
import axios from "axios";

// Import des icônes
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";

// Import du style CSS
import "../../style/Login.css";

// Import du logo
import logo from "../../images/logo.png";

// Import du contexte d'authentification
import { useAuth } from "../../components/AuthContext";

export default function Login() {

  // Hook pour redirection vers d'autres pages
  const navigate = useNavigate();

  // État pour afficher ou cacher le mot de passe
  const [showPassword, setShowPassword] = useState(false);

  // État pour afficher loading (spinner)
  const [loading, setLoading] = useState(false);

  // État pour afficher message d'erreur
  const [errorMsg, setErrorMsg] = useState("");

  // État du formulaire (username, password, remember)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  // Fonction login depuis AuthContext (stocke user + token)
  const { login } = useAuth();

  // Fonction appelée quand on clique sur "Se connecter"
  const handleLogin = async (e) => {

    e.preventDefault(); // Empêche le rechargement de la page
    setLoading(true);   // Active le loading
    setErrorMsg("");    // Réinitialise l'erreur

    try {
      // Envoi des données vers Laravel API
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        username: formData.username,
        password: formData.password,
      });

      // Récupération de l'utilisateur depuis la réponse
      const user = res.data.user;

      // Stocker user + token (dans localStorage ou context)
      login(user, res.data.token);

      // Petite pause pour UX (animation)
      setTimeout(() => {

        // Si admin → dashboard principal
        if (user.role === "admin") {
          navigate("/");
        } else {

          // Sinon redirection selon type d'opération
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

      // Si erreur (login incorrect)
      setErrorMsg("Identifiant ou mot de passe incorrect.");

      // Désactiver loading
      setLoading(false);
    }
  };

  // Liste des fonctionnalités affichées à gauche
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

        {/* PARTIE GAUCHE (Présentation) */}
        <div className="ocp-left">

          {/* Titre de l'application */}
          <div className="ocp-app-title">BG Stripping</div>

          <div className="ocp-divider" />

          {/* Description */}
          <p className="ocp-desc">
            Notre application <strong>BG Stripping</strong> offre une gestion
            complète des opérations industrielles :
          </p>

          {/* Liste des fonctionnalités */}
          <ul className="ocp-features">
            {features.map((f, i) => (
              <li key={i} className="ocp-feature-item">
                <span className="ocp-feature-dot" />
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        {/* PARTIE DROITE (Formulaire login) */}
        <div className="ocp-right">

          {/* Logo */}
          <div className="ocp-logo-wrap">
            <img src={logo} alt="Logo" className="ocp-logo-img" />
          </div>

          {/* Titre */}
          <h2 className="ocp-form-title">Connexion</h2>
          <p className="ocp-form-sub">Accédez à votre espace de travail</p>

          {/* FORMULAIRE */}
          <form onSubmit={handleLogin}>

            {/* INPUT USERNAME */}
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

            {/* INPUT PASSWORD */}
            <div className="ocp-field">
              <label>Mot de passe</label>

              <div className="ocp-input-wrap">
                <FaLock className="ocp-fi" />

                <input
                  type={showPassword ? "text" : "password"} // afficher ou cacher
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={loading}
                />

                {/* Bouton afficher/cacher password */}
                <span
                  className="ocp-toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* CHECKBOX REMEMBER */}
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

            {/* BOUTON LOGIN */}
            <button
              type="submit"
              className={`ocp-btn${loading ? " loading" : ""}`}
              disabled={loading}
            >
              {/* Spinner si loading */}
              {loading ? <span className="ocp-spinner" /> : "Se connecter"}
            </button>

            {/* MESSAGE D'ERREUR */}
            {errorMsg && <div className="ocp-error">{errorMsg}</div>}
          </form>
        </div>

      </div>
    </div>
  );
}