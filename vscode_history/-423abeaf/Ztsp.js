
// export default function Hello({lastname}){
//     return <div>Bonjour {lastname}</div>
// }

import React from "react"

export default class Hello extends React.Component {
    render(){
        console.log(this)
        return (<h1> Hello world hello world{this.props.lasname} </h1>)
    }
}