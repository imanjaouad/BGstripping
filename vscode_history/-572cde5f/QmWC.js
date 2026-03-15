// childrenName.js
import React from 'react';

export default class ChildName extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <p>child name component: {this.props.name}</p>;
  }
}
