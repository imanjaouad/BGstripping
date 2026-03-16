export default function Card(props){
    
    return (
        <div className="card">
            <div className="card1" style={{width:"100px",height:"110px",backgroundColor:"blue"}}></div>
            <h1>le titre :{props.title}</h1>
            <p>le prix : {props.prix}</p>
            <button>shop</button>
        </div>
    )
}