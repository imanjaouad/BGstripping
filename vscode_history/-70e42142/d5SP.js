import React from "react";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id : 11 }; // إذا بغيت id
  }

  render() {
    return (
      <div>
        <h2>Home {this.state.id}</h2>
      </div>
    );
  }
}

export default Home;
