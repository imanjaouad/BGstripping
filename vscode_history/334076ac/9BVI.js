import React from "react";

export default class Children extends React.Component {
  constructor(props) {
    super(props)
    this.state=({message:"this is the first message"})
  }
  changeMessage(){
    this.setState({message:"message changed"})
  }
  render() {
    return (
        <React.Fragment>
      <div>
        
      </div>
      </React.Fragment>
    );
  }
}

