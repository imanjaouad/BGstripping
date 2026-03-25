import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserPlus, FaEdit, FaTrash, FaUsers, FaShieldAlt } from "react-icons/fa";
import { fetchUsersAPI, createUserAPI, updateUserAPI, deleteUserAPI } from "../../services/api";
import "../../style/UserManagement.css";

export default function UserManagement() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "limited",
    modeOpiration: "poussage",
  });

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchUsersAPI();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ username: "", password: "", role: "limited", modeOpiration: "poussage" });
    setEditingUser(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingUser) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password; // Don't send empty password
        await updateUserAPI(editingUser.id, payload);
        setSuccess("Utilisateur modifié avec succès !");
      } else {
        await createUserAPI(formData);
        setSuccess("Utilisateur créé avec succès !");
      }
      resetForm();
      loadUsers();
    } catch (err) {
      setError(err.data?.message || err.message || "Erreur lors de l'opération");
    }

    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: "",
      role: user.role,
      modeOpiration: user.modeOpiration,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (user) => {
    if (currentUser && user.id === currentUser.id) {
      setError("Vous ne pouvez pas supprimer votre propre compte !");
      return;
    }

    if (!window.confirm(`Supprimer l'utilisateur "${user.username}" ?`)) return;

    setError("");
    setSuccess("");

    try {
      await deleteUserAPI(user.id);
      setSuccess("Utilisateur supprimé avec succès !");
      loadUsers();
    } catch (err) {
      setError(err.message || "Erreur lors de la suppression");
    }

    setTimeout(() => setSuccess(""), 3000);
  };

  const roleLabel = (role) => {
    if (role === "admin") return "Admin";
    return "Limité";
  };

  const modeLabel = (mode) => {
    const map = { poussage: "Poussage", casement: "Casement", transport: "Transport" };
    return map[mode] || mode;
  };

  return (
    <div className="um-page">
      {/* Header */}
      <div className="um-header-bar">
        <button className="um-btn-back" onClick={() => navigate("/")}>
          <FaArrowLeft /> Retour Accueil
        </button>
        <div>
          <div className="um-header-label">Administration</div>
          <h1 className="um-header-title">
            <FaUsers style={{ marginRight: 10 }} />
            Gestion des Utilisateurs
          </h1>
        </div>
      </div>

      <div className="um-layout">
        {/* Form Card */}
        <div className="um-form-card">
          <div className="um-form-header">
            <FaUserPlus style={{ fontSize: 18 }} />
            <h3>{editingUser ? "Modifier l'utilisateur" : "Nouvel Utilisateur"}</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="um-form-group">
              <label className="um-label">Nom d'utilisateur</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ex: ahmed.benali"
                className="um-input"
                required
              />
            </div>

            <div className="um-form-group">
              <label className="um-label">
                Mot de passe {editingUser && <span className="um-hint">(laisser vide pour ne pas changer)</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={editingUser ? "••••••••" : "Minimum 4 caractères"}
                className="um-input"
                {...(!editingUser && { required: true, minLength: 4 })}
              />
            </div>

            <div className="um-form-row">
              <div className="um-form-group">
                <label className="um-label">Rôle</label>
                <select name="role" value={formData.role} onChange={handleChange} className="um-select">
                  <option value="admin">Admin</option>
                  <option value="limited">Limité (lecture seule)</option>
                </select>
              </div>

              <div className="um-form-group">
                <label className="um-label">Page Assignée</label>
                <select name="modeOpiration" value={formData.modeOpiration} onChange={handleChange} className="um-select">
                  <option value="poussage">Poussage</option>
                  <option value="casement">Casement</option>
                  <option value="transport">Transport</option>
                </select>
              </div>
            </div>

            {error && <div className="um-alert um-alert-error">{error}</div>}
            {success && <div className="um-alert um-alert-success">{success}</div>}

            <div className="um-form-actions">
              {editingUser && (
                <button type="button" className="um-btn um-btn-cancel" onClick={resetForm}>
                  Annuler
                </button>
              )}
              <button type="submit" className="um-btn um-btn-primary">
                {editingUser ? "Mettre à jour" : "Créer l'utilisateur"}
              </button>
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div className="um-table-card">
          <div className="um-table-header">
            <div>
              <h3>Utilisateurs Existants</h3>
              <p className="um-table-sub">{users.length} utilisateur(s) enregistré(s)</p>
            </div>
            <button className="um-btn um-btn-refresh" onClick={loadUsers} disabled={loading}>
              {loading ? "Chargement..." : "Actualiser"}
            </button>
          </div>

          <div className="um-table-wrap">
            <table className="um-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>Page Assignée</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="um-empty">
                      {loading ? "Chargement..." : "Aucun utilisateur trouvé."}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="um-user-cell">
                          <div className="um-avatar">{user.username.charAt(0).toUpperCase()}</div>
                          <span className="um-username">{user.username}</span>
                          {currentUser && user.id === currentUser.id && (
                            <span className="um-badge-you">Vous</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`um-role-badge ${user.role === "admin" ? "um-role-admin" : "um-role-limited"}`}>
                          <FaShieldAlt style={{ fontSize: 10, marginRight: 4 }} />
                          {roleLabel(user.role)}
                        </span>
                      </td>
                      <td>
                        <span className="um-mode-badge">{modeLabel(user.modeOpiration)}</span>
                      </td>
                      <td>
                        <div className="um-actions">
                          <button className="um-action-btn um-action-edit" onClick={() => handleEdit(user)} title="Modifier">
                            <FaEdit />
                          </button>
                          {currentUser && user.id === currentUser.id ? (
                            <button className="um-action-btn um-action-delete" disabled title="Impossible de supprimer votre propre compte">
                              <FaTrash />
                            </button>
                          ) : (
                            <button className="um-action-btn um-action-delete" onClick={() => handleDelete(user)} title="Supprimer">
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
