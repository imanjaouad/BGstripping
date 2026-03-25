import React from "react";

export default class Children extends React.Component {
  constructor(props) {
    super(props)
    this.state=({opacity1,opacity2,opacity3})
  }
  changeoOpacity(){
    this.setState({opacity1:1})
  }
  ch render() {
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

