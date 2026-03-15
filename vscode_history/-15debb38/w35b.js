import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../store/actions';

function PostList() {
  // On récupère les 3 parties du state
  const { loading, posts, error } = useSelector((state) => state);
  const dispatch = useDispatch();

  // On lance le fetch au chargement du composant
  
    dispatch(fetchPosts());
  }, [dispatch]);

  // Gestion des affichages conditionnels
  if (loading) {
    return <h2>Chargement des articles...</h2>;
  }

  if (error) {
    return <h2 style={{ color: 'red' }}>{error}</h2>;
  }

  return (
    <div>
      <h1>Liste des Titres</h1>
      <button onClick={fetchPosts}></button>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;