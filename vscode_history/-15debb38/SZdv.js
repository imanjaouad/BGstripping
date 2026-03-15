import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../store/actions';
import imgErreur from '../erreur.png'

function PostList() {
  const { loading, posts, error } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleLoadPosts = () => {
    dispatch(fetchPosts());
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Les posts :</h1>

      <button 
        onClick={handleLoadPosts} 
        disabled={loading}
        style={{ padding: "10px", marginBottom: "20px" }}
      >
        {loading ? "Chargement..." : "LOAD POSTS"}
      </button>

      {/* -------------------------------------------------- */}
      {/* CAS ERREUR AVEC IMAGE PNG                          */}
      {/* -------------------------------------------------- */}
      {error && (
        <div>
          {/* L'IMAGE D'ERREUR */}
          <img 
            src={imgErreur} 
            alt=""
            style={{ width: "150px", height: "150px", marginBottom: "10px" }}
          />
          
          <h3 style={{ color: "red" }}>Oups ! Il y a un problème. {error}</h3>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* CAS SUCCÈS                                         */}
      {/* -------------------------------------------------- */}
      {!loading && !error && (
        <div>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "4px double black",
                padding: "10px",
                backgroundColor: "lightgray",
                marginBottom: "15px"
              }}
            >
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostList;