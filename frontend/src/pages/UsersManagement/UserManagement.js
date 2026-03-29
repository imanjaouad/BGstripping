import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/Api";
import "../../style/UserManagement.css";

import {
  FaSearch,
  FaEye,
  FaEyeSlash,
 
} from "react-icons/fa";

const UserManagement = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterMode, setFilterMode] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "superviseur",
    mode_operation: "poussage"
  });

  const [editingId, setEditingId] = useState(null);

  const [alert, setAlert] = useState({ message: "", type: "" });

  const isAdmin = currentUser?.role === "admin";

 

  // ================= PROTECTION =================
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, []);

  // ================= FETCH USER =================
  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/me");
      setCurrentUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users", {
        params: {
          search,
          role: filterRole,
          mode: filterMode
        }
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [search, filterRole, filterMode]);

  // ================= ALERT AUTO HIDE =================
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // ================= ADD / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, form);
        setAlert({ message: "✅ Utilisateur modifié avec succès", type: "success" });
        setEditingId(null);
      } else {
        await api.post("/users", form);
        setAlert({ message: "✅ Utilisateur ajouté avec succès", type: "success" });
      }

      setForm({
        username: "",
        password: "",
        role: "superviseur",
        mode_operation: "poussage"
      });

      fetchUsers();

    } catch (error) {
      setAlert({
        message: error.response?.data?.message || "❌ Une erreur s'est produite",
        type: "error"
      });
    }
  };

  // ================= EDIT =================
  const handleEdit = (user) => {
    setForm({
      username: user.username,
      password: "",
      role: user.role,
      mode_operation: user.mode_operation
    });
    setEditingId(user.id);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (currentUser?.id === id) {
      setAlert({ message: "❌ Vous ne pouvez pas supprimer votre propre compte !", type: "error" });
      return;
    }

    const adminCount = users.filter(u => u.role === "admin").length;
    const userToDelete = users.find(u => u.id === id);

    if (userToDelete.role === "admin" && adminCount === 1) {
      setAlert({ message: "❌ Impossible de supprimer le dernier admin !", type: "error" });
      return;
    }

    if (window.confirm("Confirmer suppression ?")) {
      await api.delete(`/users/${id}`);
      setAlert({ message: "🗑️ Utilisateur supprimé avec succès", type: "success" });
      fetchUsers();
    }
  };

  return (
    <div className="dashboard-layout">

     

      {/* MAIN */}
      <div className="main-content">

        {alert.message && (
          <div className={`custom-alert ${alert.type}`}>
            {alert.message}
          </div>
        )}

       
        {/* Bouton Retour */}
<div className="back-btn-container">
  <button className="btn-back" onClick={() => navigate("/")}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
    Retour à l'accueil
  </button>
</div>

        <h2>Gestion des Utilisateurs</h2>

        {/* FILTERS */}
        <div className="users-filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select onChange={(e) => setFilterRole(e.target.value)}>
            <option value="">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="superviseur">Superviseur</option>
          </select>

          <select onChange={(e) => setFilterMode(e.target.value)}>
            <option value="">Tous les modes</option>
            <option value="poussage">Poussage</option>
            <option value="casement">Casement</option>
            <option value="transport">Transport</option>
          </select>
        </div>

        {/* FORM */}
        {isAdmin && (
          <form className="users-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <span className="password-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <select
              value={form.mode_operation}
              onChange={(e) => setForm({ ...form, mode_operation: e.target.value })}
            >
              <option value="poussage">Poussage</option>
              <option value="casement">Casement</option>
              <option value="transport">Transport</option>
            </select>

            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="superviseur">Superviseur</option>
            </select>

            <button type="submit" className="add-btn">
              {editingId ? "Modifier" : "Ajouter"}
            </button>
          </form>
        )}

        {/* TABLE */}
        <table className="users-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Mode</th>
              <th>Role</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.mode_operation}</td>
                <td>{u.role}</td>

                {isAdmin && (
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(u)}>
                      Modifier
                    </button>

                    <button className="btn-delete" onClick={() => handleDelete(u.id)}>
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default UserManagement;