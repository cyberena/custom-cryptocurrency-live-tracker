import React, { Component } from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import auth from "../services/authServices";
import * as userService from "../services/userServices";

class Register extends Form {
  state = {
    data: { email: "", password: "", name: "" },
    errors: {}
  };

  schema = {
    email: Joi.string()
      .required()
      .email()
      .label("Email"),
    password: Joi.string()
      .required()
      .min(5)
      .label("Password"),
    name: Joi.string()
      .required()
      .label("Name")
  };

  doSubmit = async () => {
    try {
      const response = await userService.register(this.state.data);
      console.log(response.data["authtoken"]);
    
      auth.loginWithJwt(response.data["authtoken"]);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <h1>Register</h1>
        <p>Registration is validated with Joi Browser schema and is saved to MongoDB backend via express api route post calls 
          and returns a JWT token to be stored in browsers local storage.
        </p>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("email", "E-Mail")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("name", "Name")}
          {this.renderButton("Register")}
        </form>
      </React.Fragment>
    );
  }
}

export default Register;
