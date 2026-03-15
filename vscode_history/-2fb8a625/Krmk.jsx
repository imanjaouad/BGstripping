export default function Card(props){
    
    return (
        <div className="card">
            <div className="card1"></div>
            <h1>le titre :{props.title}</h1>
            <p>le prix : {props.prix}</p>
            <button>shop</button>
        </div>
    )
}