import React from "react";

export default function LeftProductCard({ name, description, prix, imageSrc, rotateImage }) {
  return (
    <div 
      className="p-4 max-w-md rounded-2xl shadow-lg bg-white flex flex-row items-start gap-4"
    >
      {/* Image à gauche */}
      <img
        src={imageSrc}
        alt={name}
        className="w-48 h-44 object-contain"
        style={{
          transform: rotateImage ? "scaleX(-1)" : "none"
        }}
      />

      {/* Texte + bouton à droite */}
      <div className="flex flex-col justify-start flex-1 gap-2">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-sm text-gray-600" style={{ fontFamily: "Do Hyeon, sans-serif" }}>
          {description}
        </p>
        <p className="text-lg font-bold">{prix}</p>

        {/* Bouton centré par rapport au texte */}
        <div className="flex justify-start mt-2">
          <button className="rounded-md text-white w-24 bg-[#192176] border-2 border-blue-700">
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
