import React from "react";

export default function LeftProductCard({ name, description, prix, imageSrc,rotateImage }) {
  return (
    <div className="p-4 max-w-sm rounded-2xl shadow-lg bg-white flex items-center gap-4">
      <img
        src={imageSrc} style={{width:"200px",height:"173px",position:"sticky",transform: rotateImage ? "scaleX(-1)" : "none"}}
        alt={name}
        className="w-24 h-24 object-contain flex-shrink-0"
      />

      <div className="flex-1">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-sm text-gray-600" style={{fontFamily:"Do Hyeon', sans-serif"}}>{description}</p>
        <p className="text-lg font-bold mt-2">{prix} </p>
        <button style={{borderRadius:"7px",color:"white",border:"2x solid blue",width:"100px",backgroundColor:"#192176"}}>Buy</button>
      </div>
    </div>

    
  );
}
