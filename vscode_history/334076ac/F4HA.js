import React from "react";

export default class Children extends React.Component {
  constructor(props) {
    super(props)
    this.state=({opacity1,opacity2,opacity3})
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

