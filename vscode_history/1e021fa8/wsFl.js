// CountryRow.js
import React, { Component } from "react";

export default class CountryRow extends Component {
  render() {
    const { nom, population, surface } = this.props;

    return (
      <tr>
        <td>{nom}</td>
        <td>{population.toLocaleString()}</td>
        <td>{surface.toLocaleString()}</td>
      </tr>
    );
  }
}
