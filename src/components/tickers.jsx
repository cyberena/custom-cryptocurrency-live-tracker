import React, { Component } from "react";
import subscribeToTimer, { subscribeToTimerAnon } from "../services/subscriptionServices.jsx";
import auth from "../services/authServices";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { connect } from "react-redux";

class Tickers extends Component {
  async componentDidMount() {  
    toast("Welcome to my demo of full MERN (React) stack app");
    //bug: this should be in parent 
    let  user = auth.getCurrentUser();
    if (user == null) {
      user = { _id: "anon" }
    }
//    this.props.dispatch({ type: "SET_USER", user })
//    await this.setState({ user });
  }



  render() {
    const { arbitrage, user, tickers, updateClass, loadingStatus } = this.props;
    return (
      <React.Fragment>
        <div className="App">
            <p className="App-intro">
            <p>Welcome to my full MERN stack customize cryptocurrency coin tracking & aritrage (scroll down to see data) application hosted on AWS servers.
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
                {arbitrage && (
                  <React.Fragment>
                  <h1>Arbitrage Exchanges</h1>
                  <p>Here we list the exchanges trading the highest and lower price for your coin. The idea is to buy from the cheapest exchange, then transfer it to the expensive exchange for selling, thus profit from arbitrage.</p>
                  </React.Fragment>
                )}


                {arbitrage  && arbitrage.map(a => (
                  <div>
                  <h2>{a.symbol.toUpperCase()}</h2>
                  <p><strong>{a.exchangeMax}</strong>: ${a.maxPrice}</p>
                  <p><strong>{a.exchangeMin}</strong>: ${a.minPrice}</p>
                  </div>
                ))}
            
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer.user,
    data: state.tickersReducer.data,
    tickers: state.tickersReducer.tickers,
    updateClass: state.tickersReducer.updateClass,
    loadingStatus: state.tickersReducer.loadingStatus,
    arbitrage: state.tickersReducer.arbitrage
  };
}


export default connect(mapStateToProps)(Tickers);
