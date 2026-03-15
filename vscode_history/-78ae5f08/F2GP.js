import pizzaImg from "./images/pizza.jpg"
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
                height:"150px",
                border:"3px solid red"
            }}

            />
        </div>
    );
}

export default Testcard;