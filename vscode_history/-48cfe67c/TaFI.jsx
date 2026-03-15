import { useState } from 'react';
import api from './api/axios';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  

  

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