import pizzaImg from "src/images/pizza.jpg"
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
            <img src={pizzaImg} alt={name} style={{
                width:"150px",
                height:"70px",
                border:"3px solid yellow"
            }}

            />
        </div>
    );
}

export default Testcard;