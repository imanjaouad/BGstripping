import { useState } from 'react';
import api from './api/axios';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // On envoie seulement ce dont Laravel a besoin pour l'instant
    const data = {
      name: name,
      email: email,
      password: password,
    };

    try {
      const response = await api.post('/register', data);
      console.log("Succès !", response.data);
      // On stocke le token pour plus tard
      localStorage.setItem('token', response.data.token);
      alert("Bravo ! Compte créé avec succès.");
    } catch (error) {
      // On affiche l'erreur exacte envoyée par Laravel
      if (error.response && error.response.data.errors) {
        const messages = Object.values(error.response.data.errors).flat().join('\n');
        alert("Erreur de validation :\n" + messages);
      } else {
        alert("Erreur serveur ou connexion impossible. Vérifie que Laravel est lancé.");
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
        <button type="submit" style={{ cursor: 'pointer', padding: '10px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
          Créer mon compte
        </button>
      </form>
    </div>
  );
}

export default App;