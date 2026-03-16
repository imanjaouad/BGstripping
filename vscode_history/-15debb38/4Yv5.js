import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../store/actions';

function PostList() {
  // On récupère l'état
  const { loading, posts, error } = useSelector((state) => state);
  const dispatch = useDispatch();

  // Cette fonction se lance UNIQUEMENT quand on clique sur le bouton
  const handleLoadPosts = () => {
    dispatch(fetchPosts());
  };

  return (
    <div>
      <h1>Mes Articles</h1>

      {/* Le bouton pour charger les données */}
      <button onClick={handleLoadPosts} disabled={loading}>
        {loading ? "Chargement en cours..." : "LOAD POSTS"}
      </button>

      {/* Gestion des erreurs */}
      {error && <h3 style={{ color: 'red' }}>{error}</h3>}

      {/* Affichage de la liste */}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;