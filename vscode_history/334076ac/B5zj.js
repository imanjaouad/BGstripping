import React from "react";

export default class Children extends React.Component {
  constructor(props) {
    super(props)
    this.state=(message:"this is the first message")
  }
  changeessage(){
    this.setState({message:"message changed"})
  }
  render() {
    return (
      <p>this is a first children - value:{this.props.value}</p>
      <h1>{this.state.message}</h1>
      <button onClick={this.changeMessage}></button>
    );
  }
}

