// export default function Etudiant({nom,prenom}){
//     return (
//         <h1>Bonjour monsieur {nom} {prenom} </h1>
//     )
// }

export default function Presentation(props){
console.log(props)
return (
<div >
<h2>Salut {props.personne.nom} {props.personne.prenom}</h2>
<hr/>
</div>
)
}

