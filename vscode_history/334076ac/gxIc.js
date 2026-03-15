import React from "react";

export default class Children extends React.Component {
  constructor(props) {
    super(props);
    this.state = {opacity1: 1,opacity2: 1,opacity3: 1,};
  }

  changeOpacity = () => {
    this.setState({
      opacity1: 0,
      opacity2: 0,
      opacity3: 0,
    });
  };

  render() {
    const { opacity1, opacity2, opacity3 } = this.state;

    return (
      <div>
        <div>
          Bloc 1 — Opacity: {opacity1}
          <button onClick={this.changeOpacity}>hide</button>
        </div>

        <div>
          Bloc 2 — Opacity: {opacity2}
          <button onClick={this.changeOpacity}>hide</button>
        </div>

        <div>
          Bloc 3 — Opacity: {opacity3}
          <button onClick={this.changeOpacity}>hide</button>
        </div>
      </div>
    );
  }
}
