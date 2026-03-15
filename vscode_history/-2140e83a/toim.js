import React from "react";

function Testcard({ name, prix, image }) {
  return (
    <div
      style={{
        border: "2px solid red",
        padding: "10px",
        width: "300px",
        height: "300px",
        textAlign: "center",
        BorderRadius: "5px",
      }}
    >
      <h2>{name}</h2>
      <p>
        <strong>Prix : {prix} dh</strong>
      </p>
      ;
      <img
        src={image}
        alt={name}
        style={{
          width: "150px",
          height: "150px",
          border: "3px solid red",
        }}
      />
    </div>
  );
}

export default Testcard;
