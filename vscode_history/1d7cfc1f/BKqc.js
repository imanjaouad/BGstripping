function navBar(){
    return(
        <nav style={{
            justifyContent:"center",
            display:"flex",
            alignItems:"center",
            padding:"15px",
            color:"black",
            fontWeight:"bold"
        }}>
            <a href="accueil" style={{color:"Blue" }}>Accueil</a>
            <a href="home" style={{color:"Blue" }}>Home</a>
            <a href="produit" style={{color:"Blue" }}>Produits</a>
            <a href="about" style={{color:"Blue" }}>About</a>

        </nav>


    )
}