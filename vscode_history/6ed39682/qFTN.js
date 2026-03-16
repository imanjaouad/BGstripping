import { render } from "@testing-library/react"
import React from "react"

export default Boule extends from React.Fragment(
    constructor(props)
)

render (
    <div className="div1">
        
    </div>
    // CountriesTable.js
import React, { Component } from "react";

export default class CountriesTable extends Component {
  constructor(props) {
    super(props);
    // on met les données dans le state
    this.state = {
      pays: [
        { name: "France", population: 1100, surface: "104000km" },
        { name: "Maroc", population: 20000, surface: "109000km" },
        { name: "Alger", population: 300000, surface: "116000km" }
      ]
    };
  }

  render() {
    return (
      <div>
        <h2>Tableau des pays</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Pays</th>
              <th>Population</th>
              <th>Surface (km)</th>
            </tr>
          </thead>
          <tbody>
            {this.state.pays.map((country, index) => (
              <tr key={index}>
                {Object.values(country).map((v, i) => (
                  <td key={i}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

)

