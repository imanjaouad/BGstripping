function Navbar(){
    return(
        <nav style={{
            justifyContent:"space-evenly",
            display:"flex",
            alignItems:"center",
            padding:"15px",
            color:"black",
            fontWeight:"bold"
        }}>
            <a href="accueil" style={{color:"black",display:"block"}}>Accueil</a>
            <a href="home" style={{color:"black",display:"block"}}>Home</a>
            <a href="produit" style={{color:"black",display:"block" }}>Produits</a>
            <a href="about" style={{color:"black",display:"block" }}>About</a>

        </nav>


    );
}

export default Navbar;