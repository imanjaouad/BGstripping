import React from "react";

export default function LeftProductCard({ name, description, prix, imageSrc,rotateImage }) {
  return (
    <div className="p-4 max-w-sm rounded-2xl shadow-lg bg-white flex items-center gap-4" style={{
      display:"flex",
      flexDirection:"column",
      alignItems:"center"
    }}>
      <img
        src={imageSrc} style={{width:"200px",height:"173px",position:"sticky",transform: rotateImage ? "scaleX(-1)" : "none"}}
        alt={name}
        className="w-24 h-24 object-contain flex-shrink-0"
      />

      <div style={{
        margin: "20px 18x 0 auto",
        borderRadius:"9px",
        width:"600px",
        color:"white",
        width:"100px",
        backgroundColor:"#192176"
      }}>
        <h2 className="text-xl font-semibold" style={{textAlign:"center"}}>{name}</h2>
        <p className="text-sm text-gray-600" style={{fontFamily:"Do Hyeon', sans-serif",textAlign:"center"}}>{description}</p>
        <p className="text-lg font-bold mt-2" style={{textAlign:"center"}}>{prix} </p>
        <div style={{justifyContent:"center",display:"flex"}}>
        <button>Buy</button>
        </div>
      </div>
    </div>

    
  );
}
