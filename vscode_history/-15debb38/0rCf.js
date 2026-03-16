import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../store/actions';
import '../App.css'; // <--- N'oublie pas d'importer le CSS ici !

function PostList() {
  const { loading, posts, error } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleLoadPosts = () => {
    dispatch(fetchPosts());
  };

  return (
    <div className="container">
      <h1>Mes Articles</h1>

      <button 
        className="btn-load" 
        onClick={handleLoadPosts} 
        disabled={loading}
      >
        {loading ? "Chargement en cours..." : "CHARGER LES POSTS"}
      </button>

      {error && <div className="error-msg">{error}</div>}

      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <strong>{post.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;