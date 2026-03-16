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
        <div style={{border:"2px solid black"}}>
        <button>hide</button>

        </div>
        <div style={{border:"2px solid black"}}>
        <button>hide</button>

        </div>
        <div style={{border:"2px solid black"}}>
        <button>hide</button>
        </div>
      </div>
      </React.Fragment>
    );
  }
}

