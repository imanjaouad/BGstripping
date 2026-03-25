import { useState, useEffect } from 'react';
import api from './api/axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  // 1. Charger les posts au démarrage
  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (err) { console.error("Erreur chargement posts", err); }
  };

  // 2. Créer un nouveau post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/posts', { content });
      setContent(''); // Vider le champ
      fetchPosts();   // Rafraîchir la liste
    } catch (err) { alert("Erreur lors de la publication"); }
  };

  // 3. Si pas de token, afficher l'inscription (on simplifie pour le test)
  if (!token) {
    return <div>Veuillez vous inscrire ou vous connecter (Relance la page après inscription)</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Mon Mini Réseau Social 📱</h1>
      
      {/* Formulaire de publication */}
      <form onSubmit={handlePostSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Quoi de neuf ?" 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc' }}
          required
        />
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '20px', background: '#1d9bf0', color: 'white', border: 'none', cursor: 'pointer' }}>
          Publier
        </button>
      </form>

      {/* Liste des posts */}
      <div>
        {posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '10px', marginBottom: '10px', background: '#f9f9f9' }}>
            <strong style={{ color: '#555' }}>@{post.user?.name}</strong>
            <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>{post.content}</p>
            <small style={{ color: '#999' }}>{new Date(post.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;