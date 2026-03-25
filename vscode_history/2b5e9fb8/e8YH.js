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
            <a href="accueil" style={{color:"black" }}>Accueil</a>
            <a href="home" style={{color:"black" }}>Home</a>
            <a href="produit" style={{color:"black" }}>Produits</a>
            <a href="about" style={{color:"black" }}>About</a>

        </nav>


    );
}

export default Navbar;