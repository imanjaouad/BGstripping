// import { Children } from "react";

import { Component } from "react";

// export default function Text({children,inputName,inputLabel}) {
//   return (
{/* <>
      <label>Username :{inputLabel}</label>
      <input name={inputName}/>
      <div>{children}</div>
      
</> ); */}
// }


export default class Text extends Component{
    render(){
            <>
      <label>Username :{inputLabel}</label>
      <input name={inputName}/>
      <div>{children}</div>
      
</> );
    }
}
