import { Children } from "react";

export default function Text(props) {
  return (
<>
      <label>Username :{props.inputLabel}</label>
      <input name={props.inputName}/>
      <div>{props.Children}</div>
      
</> );
}
