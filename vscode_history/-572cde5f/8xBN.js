// childrenName.js
import React, { Component } from 'react';

export default class ChildName extends Component {
  render() {
    return <p>child name component: {this.props.name}</p>;
  }
}
