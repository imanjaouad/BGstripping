import React from 'react';

export default function Presentation(props) {
  const { nom, prenom } = props.personne;
  return (
    <div>
      <h2>Salut {nom} {prenom}</h2>
      <hr />
    </div>
  );
}
