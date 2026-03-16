export default function Text({inputName,inputLabel}) {
  return (
<>
      <label>Username :{inputLabel}</label>
      <input name={inputName}/>
      <p>veuillez saisir votre prenom !</p>
</> );
}
