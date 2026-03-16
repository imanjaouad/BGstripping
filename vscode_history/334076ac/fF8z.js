import React from "react";

export default class Children extends React.Component {
  constructor(props) {
    super(props);
    this.state = {opacity1: 1,opacity2: 1,opacity3: 1,};
  }

  changeOpacity(){
    this.setState({opacity1:0});
  };
  changeOpacity(){
    this.setState({opacity2:0});
  };
  changeOpacity(){
    this.setState({opacity3:0});
  };


  render() {

    return (
      <div>
        <div>
          <p style={{opacity:opacity1}}>This is component</p>
          <button onClick={this.changeOpacity}>hide</button>
        </div>

        <div>
          <p style={{opacity:opacity2}}>This is component</p>
          <button onClick={this.changeOpacity}>hide</button>
        </div>

        <div>
          <p style={{opacity:opacity3}}>This is component</p>
          <button onClick={this.changeOpacity}>hide</button>
        </div>
      </div>
    );
  }
}
