function Testcard(){
    const name = "Pizza au fromage";
    const prix = 20;
    return (
        <div style={{
            border:"2px solid red",
            padding: "10px",
            width:"300px",
            height:"300px",
            textAlign:"center",
            BorderRadius:"5px"
        }}
        >
            <h2> Le nom du produit : {name}</h2>
            <p>Le prix du produit :{prix}</p>;

        </div>
    );
}

export default Testcard;