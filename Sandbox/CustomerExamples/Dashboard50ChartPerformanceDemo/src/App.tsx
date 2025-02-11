import React from "react";
import Chart from "./Chart";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SciChart.js with React hello world!</h1>
        <p>
          In this example we setup webpack, react and use scichart +
          scichart-react to create a simple chart with one X and Y axis
        </p>
      </header>
      <Chart />
    </div>
  );
}

export default App;
