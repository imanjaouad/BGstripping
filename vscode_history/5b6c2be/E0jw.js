import { Children } from "react";

export default function Text({inputName,inputLabel}) {
  return (
<>
      <label>Username :{inputLabel}</label>
      <input name={inputName}/>
      <div>{Children}</div>
      
</> );
}
