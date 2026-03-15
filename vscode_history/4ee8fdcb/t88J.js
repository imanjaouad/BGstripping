// store/actionCreators.js
import * as actionTypes from "./actionTypes";

export const addArticle = (article) => {
  return {
    type: actionTypes.ADD_ARTICLE,
    article,
  };
  export const removeArticle = (id)=>({
    type: actionTypes.REMOVE_ARTICLE,
    id
  })
};
