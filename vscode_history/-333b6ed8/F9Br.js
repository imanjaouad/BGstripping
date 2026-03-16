import React from "react";
import "./Cards.css"; // CSS pour les cards

function Cards({ name, username, email, street }) {
  return (
    <div className="card">
      <h3 className="card-title">{name}</h3>
      <p><strong>Username:</strong> {username}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Street:</strong> {street}</p>
    </div>
  );
}

export default Cards;
