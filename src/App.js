import logo from "./indexBackground.jpg";
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


class App extends Component {
  componentDidMount = () => {
    const user = auth.getCurrentUser();
    this.props.dispatch({ type: "SET_USER", user: user });
  };



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
    user: state.userReducer.user
  };
}

export default connect(mapStateToProps)(App);
