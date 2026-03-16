import React from "react";
class Home extends React.Component {
  render() {
    constructor(props){
    super(props);
    this.state = {id:props.id}
  }
    return (
      <div>
        <h2>Home {this.state.id}</h2>
      </div>
    );
  }
}

export default Home;
