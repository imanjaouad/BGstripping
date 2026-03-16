import React from "react";
class About extends React.Component {
  constructor(props){
    super(props);
    this.state = {id:props.id}
  }
  render() {
    
    return (
      <div>
        <h2>About {this.state.id}</h2>
      </div>
    );
  }
}

export default About;
