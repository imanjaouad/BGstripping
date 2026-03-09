// src/pages/Login/Login.js
// Exemple d'utilisation de loginSuccess depuis Redux dans la page Login
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../store/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      // ── Remplacez par votre appel API réel ──────────────
      // const res = await api.post("/auth/login", { email, password });
      // const { user, token } = res.data;

      // Simulation (à remplacer)
      const user  = { id: 1, name: "Ahmed Karim", role: "Admin", email };
      const token = "fake-jwt-token-xyz";
      // ─────────────────────────────────────────────────────

      // Dispatch Redux → sauvegarde user + token dans le store et localStorage
      dispatch(loginSuccess({ user, token }));

      // Redirige vers le dashboard
      navigate("/dashboard");

    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div style={{ /* vos styles */ }}>
      <h2>Connexion</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input type="email"    value={email}    onChange={(e) => setEmail(e.target.value)}    placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
      <button onClick={handleSubmit}>Se connecter</button>
    </div>
  );
}
