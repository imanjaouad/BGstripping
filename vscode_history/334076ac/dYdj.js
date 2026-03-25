import React from "react";

export default class Children extends React.Component {
  constructor(props) {
    super(props)
    this.state=(message:"this is the first message")
  }

  render() {
    return (
      <p>this is a first children - value:{this.props.value}</p>
    );
  }
}

