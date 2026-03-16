import React from "react";

const Produit = ({ produit }) => {
  return (
    <div className="carte-produit">
      <img
        src={produit.thumbnail}
        alt={produit.title}
        style={{ width: "150px", height: "100px", objectFit: "cover" }}
      />
      <h3>{produit.title}</h3>
      <p>Prix: {produit.price}</p>
    </div>
  );
};

export default Produit;
