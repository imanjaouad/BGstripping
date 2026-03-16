
// export default function Hello({lastname}){
//     return <div>Bonjour {lastname}</div>
// }

import { render } from "@testing-library/react";
import { Component } from "react";

export default class Hello() extends React.Fragment {
    render(){
        return (<h1> Hello world hello world </h1>)
    }
}