// components/Article.js
import React from "react";

const Article = ({ article }) => (
  <div className="article">
    <h1>{article.title}</h1>
    <p>{article.body}</p>
  </div>
);

export default Article;
