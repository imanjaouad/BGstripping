import React from 'react';

export  function defaultPresentation(props) {
  const { nom, prenom } = props.personne;
  const { diplomes } = props;

  return (
    <div>
      <h2>Salut {nom} {prenom}</h2>
      <hr />
      <h3>Diplômes</h3>
      <ul>
        {diplomes.map((diplome, index) => (
          <li key={index}>{diplome}</li>
        ))}
      </ul>
    </div>
  );
}
