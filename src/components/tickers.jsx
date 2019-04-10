import React, { Component } from "react";
import subscribeToTimer, { subscribeToTimerAnon } from "../services/subscriptionServices.jsx";
import auth from "../services/authServices";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";


class Tickers extends Component {
  state = {
    data: [],
    tickers: null,
    updateClass: "normal",
    user: "",
    loadingStatus: "Loading..."
  };

  //this function could be refactored
  updateTickersRealTimeAnon = async (ticker) => {
    this.setState({ updateClass : "normal" });
    let tickers = [];
    if (this.state.tickers) {
      tickers = [...this.state.tickers];
    }
    
    let matchIndex = tickers.findIndex(x => x.ticker === ticker.newTicker.ticker);
    if (matchIndex === -1) {
      tickers.push(ticker.newTicker);
      this.setState({ tickers });
    } else {
      tickers[matchIndex] = ticker.newTicker;
      this.state.tickers[matchIndex] = ticker.newTicker;
      this.forceUpdate();
    }
    this.setState({ updateClass: "glow" });
    this.setState({ loadingStatus: "" });
  }

  //this function could be refactored
  updateTickersRealTime = async (ticker) => {
    this.setState({ updateClass : "normal" });
    let tickers = [...this.state.tickers];
    let matchIndex = tickers.findIndex(x => x.ticker === ticker.newTicker.ticker);
    tickers[matchIndex] = ticker.newTicker;

    this.state.tickers[matchIndex] = ticker.newTicker;
    this.forceUpdate();
    this.setState({ updateClass: "glow" });
    this.setState({ loadingStatus: "" });
  }

  async componentDidMount() {  
    toast("Welcome to my demo of full MERN (React) stack app");


    const user = auth.getCurrentUser();
    await this.setState({ user });
//    var intervalId = setInterval(this.getUpdateInterval, 4000);
//    console.log(this.props);
    if (user) this.getUpdateInterval(); 
    else subscribeToTimerAnon(this.updateTickersRealTimeAnon);

  }

   getUpdateInterval = async () => {
    let tickers = await fetch("http://18.191.24.252:3900/api/tickers/update/" + this.state.user._id);
    tickers = await tickers.json();
    this.setState({ tickers });
    subscribeToTimer(this.updateTickersRealTime, this.state.user._id);
    //    setTimeout(this.setState({updateClass: ''}), 1000);
    
  }


  render() {
    const { loadingStatus, user,  tickers, updateClass } = this.state;
    return (
      <React.Fragment>
        <div className="App">
            <p className="App-intro">
            <p>Welcome to my full MERN stack customize cryptocurrency coin tracking application hosted on AWS servers.
            This app was coded and setup from scratch.</p>
            {tickers && (tickers.length==0) && (
              <p>Thanks for registering, please click&nbsp;
                      <Link  to="/setup">
                        SETUP
                      </Link>
                      &nbsp;to add your own custom coins</p>
              )}
            </p>

            {!user && (
              <p>{loadingStatus}</p>
            )}
            {tickers && (tickers.length!=0) && (
            <React.Fragment>
              <p>Tickers are sent real time via socket io and will highlight when updated via state.</p>
              
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Ticker</th>
                    <th scope="col">Price (BTC)</th>
                  </tr>
                </thead>
                <tbody>
                {tickers.map(t => (
                  <tr>
                    <td><p key={t.price} className={updateClass}>{t.ticker.toUpperCase()}</p></td>
                    <td><p key={t.price} className={updateClass}>{t.price}</p></td>
                  </tr>
                ))}
                </tbody>
              </table>
            </React.Fragment>
            )}
        </div>
      </React.Fragment>
    );
  }
}

export default Tickers;
