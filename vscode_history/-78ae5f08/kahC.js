function Testcard(){
    const name = "Pizza au fromage";
    const prix = 20;
    return (
        <div style={{
            border:"2px solid red",
            padding: "10px",
            width:"100px",
            height:"300px",
            textAlign:"center,
            BorderRadius:"5px"
        }}
            Name : <h2>{name}</h2>
            Prix : {prix};

        </div>
    );
}

export default Testcard;