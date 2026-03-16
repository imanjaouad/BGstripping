import React from "react";

export default class Children extends React.Component {
  constructor(props) {
    super(props);
    this.state = { opacity1: 1, opacity2: 1, opacity3: 1 };
  }

  changeOpacity1 = () => {
    this.setState({ opacity1: 0 });
  };

  changeOpacity2 = () => {
    this.setState({ opacity2: 0 });
  };

  changeOpacity3 = () => {
    this.setState({ opacity3: 0 });
  };

  render() {
    return (
      <div>
        <div>
          <p style={{ opacity: this.state.opacity1 }}>This is component</p>
          <button onClick={this.changeOpacity1}>hide</button>
        </div>

        <div>
          <p style={{ opacity: this.state.opacity2 }}>This is component</p>
          <button onClick={this.changeOpacity2}>hide</button>
        </div>

        <div>
          <p style={{ opacity: this.state.opacity3 }}>This is component</p>
          <button onClick={this.changeOpacity3}>hide</button>
        </div>
      </div>
    );
  }
}
