import { useState } from "react"

export default function Calcul(){
    const [montant,setMontant]=useState("");
    const [nbrjours,setNbrjours]=useState("")
    const [pourcentage,setPourcentage]=useState("")
    const handleChange (e)=>{
            e.preventDefault()
    }
        return (
        <div>
            <form action="" >

            <input type="text" value={montant} onChange={(e)=>setMontant(e.target.value)}/><br />
            <input type="number" max={30} onChange={(e)=>setNbrjours(e.target.value)}/><br />
            <input type="text" value={pourcentage} onChange={(e)=>setPourcentage(e.target.value)}/><br />
            <button type="submit">calculer</button>
            </form>

        </div>
    )
}