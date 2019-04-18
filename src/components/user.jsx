import React, { Component } from "react";
import Form from "./common/form";
import Joi from "joi-browser"
import { updateUser } from "../services/userServices";
import auth from "../services/authServices";
import http from "../services/httpServices";

class Setup extends Form {
  state = {
    data: { email: this.props.user.email, name: this.props.user.name },
    tickers: "",
    userID: this.props.user._id,
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


  doSubmit = async () => {
    alert("do submit");
    console.log("doing submit")
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
    http.post("http://18.221.49.186:3900/api/tickers", {updateTicker: this.state} );
  }

  onChangeTicker = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
//    data[input.ticker] = input.value.split(',');
    data.tickers = input.value;

    this.setState({ data });
  }

  render() {
    return (
      <React.Fragment>
        <div className="App">
          <header className="App-header">
            <p>Welcome {this.props.user.email}</p>
            <form onSubmit={this.handleSubmit}>
              {this.renderInput("email", "E-Mail")}
              {this.renderInput("name", "Full Name")}
              {this.renderButton("Update")}
            </form>

            <form onSubmit={this.handleSubmitUpdateTicker}>
            {this.renderInput("tickers", "Tickers", this.onChangeTicker)}
            {this.renderButton("Update Tickers", true)}
            </form>
          </header>
        </div>
        <div>Tickers</div>
      </React.Fragment>
    );
  }
}

export default Setup;
