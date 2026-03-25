import logo from "./pictures/Rectangle 2.png"
export function Footer() {
return (
<footer style={{ marginTop: 40, padding: 20, textAlign: "center", borderTop: "1px solid #ddd" }}>
<a href="#" style={{ margin: 10,color:"black" }}>Aide</a>
<a href="#" style={{ margin: 10,color:"black" }}>Paramètres</a>
<a href="#" style={{ margin: 10,color:"black" }}>Contact</a>
<div>
<img src={logo} alt="Logo" style={{ width: 80,backgroundColor:"black",height:40,borderRadius:13,marginLeft:20,marginTop:10}} />
</div>
</footer>
);
}

