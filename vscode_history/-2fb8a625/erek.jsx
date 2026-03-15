import styled from "styled-components";

const dv = styled.div`
background-color:"grey";
border-radius:13px;
border: 2px solid blue
`
export default function Card(props){
    
    return (
        <div className="card">
            <dv className="card1"></dv>
            <h1>le titre :{props.title}</h1>
            <p>le prix : {props.prix}</p>
            <button>shop</button>
        </div>
    )
}