import React, { Component } from "react";
import Form from "./common/form";
import Joi from "joi-browser"
import { updateUser } from "../services/userServices";
import auth from "../services/authServices";
import http from "../services/httpServices";
import tickerServices from "../services/tickerServices";

class Setup extends Form {
  state = {
    data: { email: "", name: "" },
    tickers: "",
    userID: "",
    errors: {}
  };

  schema = {
    email: Joi.string()
      .email()
      .label("E-Mail"),
     name: Joi.string()
       .required()
      .label("Name")
  };

  constructor(props) {
    super(props);
    this.state = {
      data: { email: props.user.email, name: this.props.user.name },
      tickers: "",
      userID: this.props.user._id,
      errors: {}
    };
  }

  async componentDidMount() {
    let tickersList = await tickerServices.getAllTickers(this.props.user._id);
    console.log(tickersList);
    
    let compressedList = [];
    tickersList.data.map(t => {
      compressedList.push(t.ticker);
    });
    compressedList = compressedList.join();
    console.log(compressedList);
    this.setState({ tickers: compressedList})
  }

  doSubmit = async () => {
    try {
      console.log("try")
      const newToken = await updateUser(this.state.data);
      console.log(newToken.data.token);
      auth.logout();
      auth.loginWithJwt(newToken.data.token);
      window.location = "/";
    } catch (ex) {
      console.log(ex)

      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  handleSubmitUpdateTicker = async (e) => {
    e.preventDefault();

    await http.post("http://18.191.24.252:3900/api/tickers", {updateTicker: this.state} );
    this.props.history.push('/');
  }

  onChangeTicker = ({ currentTarget: input }) => {
    let { tickers } = { ...this.state };
    tickers = input.value;

    this.setState({ tickers });
  }

  render() {
    return (
      <React.Fragment>
        <div className="App">
          <header className="App-header">
            <h1>Account Setup</h1>
            <p>Setup allows you to update your profile Full Name or add a list of customized tickers.</p>
            <form onSubmit={this.handleSubmit}>
              {/* {this.renderInput("email", "E-Mail")} */}
              {this.renderInput("name", "Full Name")}
              {this.renderButton("Update")}
            </form>

            <h1 className="mt-5">Tickers</h1>
            <p>Ticker validation is limited, please only use valid ticker symbols (excluding BTC)</p>
            <form onSubmit={this.handleSubmitUpdateTicker}>
            {this.renderInputCustom("tickers", "(enter comma seperated coin symbols)", this.onChangeTicker, this.state.tickers, "i.e. xrp, eth, eos")}
            {this.renderButtonCustom("Update Tickers", true)}
            </form>
          </header>
        </div>
      </React.Fragment>
    );
  }
}

export default Setup;
