import React, { useState } from "react";

const AjoutLivre = () => {
  const [livre, setLivre] = useState({
    num: "",
    titre: "",
    dateEdition: "",
    genre: "",
    prix: "",
  });

  const [listeLivres, setListeLivres] = useState([]);
  // Mettre à jour les champs
  const handleChange = (e) => {
    setLivre({ ...livre, [e.target.name]: e.target.value });
  };

  // Ajouter un livre à la liste
  const ajouterLivre = (e) => {
    e.preventDefault();

    // Vérifier le prix
    if (Number(livre.prix) > 200) {
      alert("Le prix ne doit pas dépasser 200 dh !");
      return;
    }

    // Ajouter à la liste
    setListeLivres([...listeLivres, livre]);

    // Réinitialiser le formulaire
    setLivre({
      num: "",
      titre: "",
      dateEdition: "",
      genre: "",
      prix: "",
    });
  };

  // Réinitialiser la liste
  const resetListe = () => {
    setListeLivres([]);
  };

  return (
    <div>
      <h2>Ajouter un Livre</h2>
      <form onSubmit={ajouterLivre}>
        <div>
          <input type="text" name="num" onChange={handleChange} required />
        </div>
        <div>
          <input
            type="text"
            name="titre"
            placeholder="Titre"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="date"
            name="dateEd"
            value={livre.dateEdition}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={livre.genre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="number"
            name="prix"
            placeholder="Prix"
            value={livre.prix}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Ajouter</button>
          <button type="button" onClick={resetListe}>
            Réinitialiser
          </button>
        </div>
      </form>

      <h3>Liste des Livres</h3>
      <ul>
        {listeLivres.map((l, index) => (
          <li key={index}>
            Num: {l.num}, Titre: {l.titre}, Date: {l.dateEdition}, Genre:{" "}
            {l.genre}, Prix: {l.prix} dh
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AjoutLivre;
