import logo from "./indexBackground.jpg";
import subscribeToTimer, { subscribeToTimerAnon } from "./services/subscriptionServices.jsx";
import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import NavBar from "./components/navBar";
import Register from "./components/register";
import Setup from "./components/setup";
import About from "./components/about";
import NotFound from "./components/notFound";
import Login from "./components/login";
import Logout from "./components/logout";
import Tickers from "./components/tickers";
import auth from "./services/authServices";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { getAllArbitrage } from "./services/tickerServices";


class App extends Component {
  componentDidMount = () => {
    let user =  auth.getCurrentUser();
    if (user == null) {
      user = { _id: "anon" }
    }
    
    this.props.dispatch({ type: "SET_USER", user: user });
    this.getArbitrage(user);
    this.getUpdateInterval(user); 
  };

  updateTickersRealTime = async (ticker) => {
    let tickers = [...this.props.tickers];
    let matchIndex = tickers.findIndex(x => x.ticker === ticker.newTicker.ticker);
    tickers[matchIndex] = ticker.newTicker;
    this.props.dispatch({ type: "UPDATE_ONE_TICKER", newTicker: ticker.newTicker, matchIndex: matchIndex })
  }


  getArbitrage = async (user) => {
    let result = await getAllArbitrage(user._id);
    console.log(result.data);
    this.props.dispatch({ type: "SET_ARBITRAGE", arbitrage: result.data });
//    result = await result.json();
//    this.props.dispatch({ type: "SET_ARBITRAGE", arbitrage: result.data });
//    console.log(await result.text());
  }

   getUpdateInterval = async (user) => {
    let tickers = "";
    tickers = await fetch("http://18.191.24.252:3900/api/tickers/update/" + user._id);
    console.log(tickers);
    tickers = await tickers.json();
    this.props.dispatch({ type: "SET_TICKERS", tickers});
    subscribeToTimer(this.updateTickersRealTime, user._id);
  }


  render() {
    const { user } = this.props;
    return (
      <React.Fragment>
        <ToastContainer />
        <BrowserRouter>
          <NavBar user={user} />

          <main className="container float-left" id="ticker-app">
          <div className="row">
            <div className="col">
              <header className="App-header row">
                <img src={logo} className="App-logo" alt="logo" />
              </header>
            </div>
            <div className="col mt-4">
              {/* Routes could be improved bymaking them protected (i.e. cant manually type urls in browser to access them) */}
              <Switch>
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/about" component={About} />
                <Route path="/setup" render={props => <Setup {...props} user={user} />} />
                <Route path="/logout" component={Logout} />
                <Route path="/not-found" component={NotFound} />
                <Route path="/" render={props => <Tickers {...props} user={user} />} />
                <Redirect from="/" exact to="/tickers" />
                <Redirect to="/not-found" />
              </Switch>
            </div>
          </div>
          </main>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer.user,
    arbitrage: state.tickersReducer.arbitrage,
    tickers: state.tickersReducer.tickers
  };
}

export default connect(mapStateToProps)(App);
