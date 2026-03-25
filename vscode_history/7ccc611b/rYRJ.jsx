import React from "react";

export default function ProduitList({ produits }) {
  if (produits.length === 0) {
    return <p>Aucun produit trouvé</p>;
  }

  return (
    <ul>
      {produits.map((prod) => (<li key={prod.id}> {prod.nom} {prod.type})
        </li>
      ))}
    </ul>
  );
}
