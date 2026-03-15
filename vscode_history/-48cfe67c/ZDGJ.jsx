import { useState } from 'react';
import api from './api/axios';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      
      console.log("Succès !", response.data);
      localStorage.setItem('token', response.data.token);
      alert("Compte créé avec succès ! Ton utilisateur est dans la base de données.");
    } catch (error) {
      console.error("Erreur :", error.response?.data);
      alert("Erreur lors de l'inscription. Regarde la console.");
    }
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  
  const data = {
    name: name,
    email: email,
    password: password,
    // On enlève password_confirmation car on l'a enlevé dans Laravel pour simplifier
  };

  try {
    const response = await api.post('/register', data);
    console.log("Succès !", response.data);
    alert("Bravo ! Compte créé.");
  } catch (error) {
    // ICI : On affiche l'erreur exacte venant de Laravel
    if (error.response && error.response.data.errors) {
      const messages = Object.values(error.response.data.errors).flat().join('\n');
      alert("Erreur de validation :\n" + messages);
    } else {
      alert("Erreur serveur ou connexion impossible.");
      console.log(error);
    }
  }
};

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>Inscription - Mini Réseau Social</h1>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirmer mot de passe" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
        <button type="submit" style={{ cursor: 'pointer', padding: '10px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
          Créer mon compte
        </button>
      </form>
    </div>
  );
}

export default App;