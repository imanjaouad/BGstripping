// components/Article.js
import React from "react";
import { REMOVE_ARTICLE } from "../store/actionTypes";

const Article = ({ article }) => (
  <div className="article">
    <h1>{article.title}</h1>
    <p>{article.body}</p>
  <button onClick={()=>removeArticle(article.id)}>supprimer article</button>
  </div>
);

export default Article;
