import { useState } from "react"

export default function Calcul(){
    const [montant,setMontant]=useState("");
    const [nbrjours,setNbrjours]=useState("")
    const [pourcentage,setPourcentage]=useState("")
        return (
        <div>
            <form action="" >

            <input type="text" value="" onChange={setMontant=>(e.target.value)}/><br />
            <input type="number" max={30} /><br />
            <input type="text" value="" /><br />
            <button type="submit">calculer</button>
            </form>

        </div>
    )
}