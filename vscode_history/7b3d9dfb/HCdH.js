import React from "react";

export default function LeftProductCard({ name, description, prix, imageSrc,rotateImage }) {
  return (
    <div className="p-4 max-w-sm rounded-2xl shadow-lg bg-white flex items-center gap-4" style={{
      display:"flex",
      flexDirection:"column",
      alignItems:"center"
    }}>
      <img
        src={imageSrc} style={{width:"200px",height:"173px",position:"revert",transform: rotateImage ? "scaleX(-1)" : "none",marginRight:"700px"}}
        alt={name}
        className="w-24 h-24 object-contain flex-shrink-0"
      />

      <div style={{
        margin: "20px 18x 0 auto",
        borderRadius:"9px",
        width:"300px",
        color:"black",
        backgroundColor:"white",
        marginBottom:"10px"
      }}>
        <h2 className="text-xl font-semibold" style={{textAlign:"center"}}>{name}</h2>
        <p className="text-sm text-gray-600" style={{fontFamily:"Do Hyeon', sans-serif",textAlign:"center"}}>{description}</p>
        <p className="text-lg font-bold mt-2" style={{textAlign:"center"}}>{prix} </p>
        <div style={{justifyContent:"center",display:"flex"}}>
        <button style={{backgroundColor:"#192176",color:"white",width:"103px",borderRadius:"8px"}}>Buy</button>
        </div>
      </div>
    </div>

    
  );
}
