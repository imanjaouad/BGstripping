// components/Article.js
import React from "react";

const Article = ({ article }) => (
  <div className="article">
    <h1>{article.title}</h1>
    <p>{article.body}</p>
  <button onClick={()=>remo}>supprimer article</button>
  </div>
);

export default Article;
