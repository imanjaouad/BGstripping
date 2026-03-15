// components/Article.js
import React from "react";

const Article = ({ article, removeArticle }) => (
  <div className="article">
    <h1>{article.title}</h1>
    <p>{article.body}</p>
    <button onClick={() => removeArticle(article.id)}>Supprimer article</button>
  </div>
);

export default Article;
