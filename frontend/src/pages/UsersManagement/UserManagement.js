import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/Api";
import "../../style/UserManagement.css";

import Navbar from "../Home/navBare";
import Header from "../Home/Header";
import Footer from "../Home/Footer";

const UserManagement = () => {

  const navigate = useNavigate();

  const currentUser = JSON.parse(sessionStorage.getItem("user"));

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

  // ================= LOGOUT =================
  const handleLogout = () => {

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");

  };

  // ================= GET USERS =================
  const fetchUsers = async () => {
    const res = await api.get("/users", {
      params: {
        search,
        role: filterRole,
        mode: filterMode
      }
    });
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, [search, filterRole, filterMode]);

  // ================= ADD / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (editingId) {
        await api.put(`/users/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post("/users", form);
      }

      setForm({
        username: "",
        password: "",
        role: "superviseur",
        mode_operation: "poussage"
      });

      fetchUsers();

    } catch (error) {
      alert(error.response?.data?.message || "Erreur");
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
      alert("❌ Vous ne pouvez pas supprimer votre propre compte !");
      return;
    }

    const adminCount = users.filter(u => u.role === "admin").length;
    const userToDelete = users.find(u => u.id === id);

    if (userToDelete.role === "admin" && adminCount === 1) {
      alert("❌ Impossible de supprimer le dernier admin !");
      return;
    }

    if (window.confirm("Confirmer suppression ?")) {
      await api.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  return (

    <>
    
      <Navbar />
      <Header />

      <div className="users-container">

        {/* ACTION BUTTONS */}

        <div style={{marginBottom:"20px", display:"flex", gap:"10px"}}>

          <button
            onClick={()=>navigate("/")}
            className="btn-home"
          >
            Retour à l'accueil
          </button>

          <button
            onClick={handleLogout}
            className="btn-logout"
          >
            Déconnexion
          </button>

        </div>

        <h2>Gestion des Utilisateurs</h2>

        {/* FILTERS */}
        <div className="users-filters">

          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          <select
            value={filterRole}
            onChange={(e)=>setFilterRole(e.target.value)}
          >
            <option value="">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="superviseur">Superviseur(e)</option>
          </select>

          <select
            value={filterMode}
            onChange={(e)=>setFilterMode(e.target.value)}
          >
            <option value="">Tous les modes</option>
            <option value="poussage">Poussage</option>
            <option value="casement">Casement</option>
            <option value="transport">Transport</option>
          </select>

        </div>

        {/* FORM */}
        <form className="users-form" onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={form.username}
            onChange={(e)=>setForm({...form, username:e.target.value})}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e)=>setForm({...form, password:e.target.value})}
            required={!editingId}
          />

          <select
            value={form.mode_operation}
            onChange={(e)=>setForm({...form, mode_operation:e.target.value})}
          >
            <option value="poussage">Poussage</option>
            <option value="casement">Casement</option>
            <option value="transport">Transport</option>
          </select>

          <select
            value={form.role}
            onChange={(e)=>setForm({...form, role:e.target.value})}
          >
            <option value="admin">Admin</option>
            <option value="superviseur">Superviseur(e)</option>
          </select>

          <button type="submit">
            {editingId ? "Modifier" : "Ajouter"}
          </button>

        </form>

        {/* TABLE */}
        <table className="users-table">

          <thead>
            <tr>
              <th>Nom d'utilisateur</th>
              <th>Mode</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u)=>(
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.mode_operation}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={()=>handleEdit(u)}
                  >
                    Modifier
                  </button>

                  <button
                    className="btn-delete"
                    onClick={()=>handleDelete(u.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      <Footer/>

    </>
  );
};

export default UserManagement;