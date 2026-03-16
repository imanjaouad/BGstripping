import logo from "./pictures/Rectangle 2.png"
export function LogoNav() {
return (

<header style={{ padding: 20, textAlign: "center", borderBottom: "1px solid #ddd" }}>
<img src={logo} alt="Logo" style={{ width: 80,backgroundColor:"black",height:40,borderRadius:13}} />
<nav style={{ marginTop: 10 }}>
<a href="#" style={{ margin: 10 }}>Home</a>
<a href="#" style={{ margin: 10 }}>Produits</a>
<a href="#" style={{ margin: 10 }}>Contact</a>
</nav>
<p style={{fontStyle:""}}>Bienvenue dans le mondes des bicycles !</p>
</header>
);
}