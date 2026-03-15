import { Children } from "react";

export default function Text({children,inputName,inputLabel}) {
  return (
<>
      <label>Username :{inputLabel}</label>
      <input name={inputName}/>
      <div>{children}</div>
      
</> );
}
