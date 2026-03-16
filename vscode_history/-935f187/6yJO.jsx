import { useState } from "react"

export default function Calcul(){
    const [montant,setMontant]=useState("");
    const [nbrjours,setNbrjours]=useState("")
    const [pourcentage,setPourcentage]=useState("")
    const [result,setResult]=useState(null);
    const handleSubmit =(e)=>{
            e.preventDefault()
    const montantNum = Number(montant);
    const nbrjoursNum = Number(nbrjours);
    const pourcentageNum = Number(pourcentage);
    
    const secoursMontant = montantNum * (pourcentageNum/100)
    const reste = montantNum - secoursMontant;
    const depenseParJour = reste / nbrjoursNum;

    setResult(depenseParJour.toFixed(2));

    }

        return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="">Montant : </label>
            <input type="text" value={montant} onChange={(e)=>setMontant(e.target.value)}/><br />
            <label htmlFor="">Montant : </label>
            <input type="number" max={30} value={nbrjours} onChange={(e)=>setNbrjours(e.target.value)}/><br />
            <label htmlFor="">Pourcentage : </label>
            <input type="text" value={pourcentage} onChange={(e)=>setPourcentage(e.target.value)}/><br />
            <button type="submit">calculer</button>
            </form>

            {
                result && <p> vous pouvez depensez par jour : {result} dh</p>
            }

        </div>
    )
}