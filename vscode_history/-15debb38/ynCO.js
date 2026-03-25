import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../store/actions';

function PostList() {
  const { loading, posts, error } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleLoadPosts = () => {
    dispatch(fetchPosts());
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Les posts :</h1>

      <button onClick={handleLoadPosts} disabled={loading} style={{ marginBottom: "20px", padding: "10px" }}>
        {loading ? "Chargement..." : "LOAD POSTS"}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Remplacement de ul/li par une div conteneur simple */}
      <div>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              // Tes styles demandés :
              border: "4px double black", // 'double' a besoin d'un peu d'épaisseur pour être visible
              padding: "10px",
              backgroundColor: "lightgray", // Correction de la typo 'lightgre'
              marginBottom: "15px", // Pour espacer les blocs
              borderRadius: "5px"   // Un tout petit peu d'arrondi (optionnel)
            }}
          >
            {/* Affichage du Titre en gras et du corps */}
            <h3 style={{ marginTop: 0 }}>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;