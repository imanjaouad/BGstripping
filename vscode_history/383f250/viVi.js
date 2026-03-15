// TES CONSTANTES
export const FETCH_POSTS_REQUEST = 'FETCH_POSTS_REQUEST';
export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
export const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';

// 1. Actions synchrones (pour changer l'état interne)
export const fetchPostsRequest = () => {
  return { type: FETCH_POSTS_REQUEST };
};

export const fetchPostsSuccess = (posts) => {
  return {
    type: FETCH_POSTS_SUCCESS,
    payload: posts
  };
};

export const fetchPostsFailure = (error) => {
  return {
    type: FETCH_POSTS_FAILURE,
    payload: error
  };
};

// 2. Action Asynchrone (le Thunk)
// C'est cette fonction qu'on appellera depuis le composant
export const fetchPosts = () => {
  return (dispatch) => {
    // A. On signale qu'on commence le chargement
    dispatch(fetchPostsRequest());

    // B. On lance l'appel API
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((data) => {
        // C. Succès : on envoie les données
        dispatch(fetchPostsSuccess(data));
      })
      .catch((error) => {
        // D. Erreur : on envoie le message d'erreur
        dispatch(fetchPostsFailure(error.message));
      });
  };
};