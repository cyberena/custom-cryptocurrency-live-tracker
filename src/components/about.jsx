import React, { Component } from "react";

class About extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>

        <div className="App">
          <header className="App-header">
            <h1>About</h1>
            <p>This is my self coded & setup from scratch full MERN stack demo app on AWS. </p>
            <p>This application allows you to register & login to create your own customized cryptocurrency coins to track real time via Binance API.</p>
            <p>Technologies used include React, MongoDB, Express, Node running and hosted on AWS Instance</p>

          </header>
        </div>
      </React.Fragment>
    );
  }
}

export default About;
