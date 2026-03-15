// containers/Articles.js
import React from "react";
import { connect } from "react-redux";
import Article from "../components/Article";
import AddArticle from "../components/AddArticle";
import { addArticle, removeArticle } from "../store/actionCreators"; // <- ajouter removeArticle

const Articles = ({ articles, saveArticle, deleteArticle }) => (
  <div>
    <AddArticle saveArticle={saveArticle} />
    {articles.map((article) => (
      <Article 
        key={article.id} 
        article={article} 
        removeArticle={deleteArticle} 
      />
    ))}
  </div>
);

const mapStateToProps = (state) => ({
  articles: state.articles,
});

const mapDispatchToProps = (dispatch) => ({
  saveArticle: (article) => dispatch(addArticle(article)),
  deleteArticle: (id) => dispatch(removeArticle(id)), // <- ici ok
});

export default connect(mapStateToProps, mapDispatchToProps)(Articles);
