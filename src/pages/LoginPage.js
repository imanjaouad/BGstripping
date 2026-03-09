import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../images/hero-phosphate-kweqZRh2w4LhFWCPyyzPjt.png";
import logo from "../images/logo.png";

const modeRoutes = {
  poussage: "/operations/poussage",
  encasement: "/operations/encasement",
  transport: "/operations/transport",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password || !mode) {
      setError("Merci de remplir email, mot de passe et mode operation.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Connexion impossible.");
      }

      if (payload?.data) {
        localStorage.setItem("auth_user", JSON.stringify(payload.data));
      }

      const targetRoute = modeRoutes[mode];
      if (targetRoute) {
        navigate(targetRoute, { state: { email, rememberMe } });
      }
    } catch (requestError) {
      setError(requestError.message || "Erreur reseau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-layout">
        <div className="login-left" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="login-left-overlay" />
          <div className="login-left-content">
            <h1>
              Optimisation du
              <br />
              Decapage de
              <br />
              Phosphate
            </h1>
            <p>Solution digitale avancee pour la gestion integree des flux de production OCP.</p>
          </div>
        </div>

        <div className="login-right">
          <form className="login-card" onSubmit={handleSubmit}>
            <img src={logo} alt="BG Stripping" className="login-logo" />
            <h2>Connexion</h2>

            <label className="login-field">
              <span>Email professionnel</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nom@entreprise.com"
                required
              />
            </label>

            <label className="login-field">
              <span>Mot de passe</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Votre mot de passe"
                required
              />
            </label>

            <label className="login-field">
              <span>Mode operation</span>
              <select value={mode} onChange={(event) => setMode(event.target.value)} required>
                <option value="">Selectionner un mode</option>
                <option value="poussage">Poussage</option>
                <option value="encasement">Encasement</option>
                <option value="transport">Transport</option>
              </select>
            </label>

            <div className="login-options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Se souvenir de moi
              </label>
              <button type="button" className="link-button">
                Mot de passe oublie ?
              </button>
            </div>

            {error ? <p className="login-error">{error}</p> : null}

            <button type="submit" className="submit-login" disabled={submitting}>
              {submitting ? "Connexion..." : "Acceder au systeme"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
