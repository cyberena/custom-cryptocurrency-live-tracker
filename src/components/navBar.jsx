import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        CYBERENA
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
        <NavLink className="nav-item nav-link" to="/about">
            About
        </NavLink>

        {user && (
            <React.Fragment>
              <span className="nav-item navbar-text pull-md-right navUser">
                Welcome {user.name}
              </span>
              <NavLink className="nav-item nav-link" to="/tickers">
                Tickers
              </NavLink>
              <NavLink className="nav-item nav-link" to="/setup">
                Setup
              </NavLink>

            </React.Fragment>
          )}
          {!user && (
            <React.Fragment>
              <NavLink className="nav-item nav-link" to="/register">
                Register
              </NavLink>
              <NavLink className="nav-item nav-link" to="/login">
                Login
              </NavLink>
              <span className="nav-item navbar-text pull-md-right navUser">
                <a href="/register">Register</a> to create & customize your coin tracking list
              </span>

            </React.Fragment>
          )}
          {user && (
              <NavLink className="nav-item nav-link navLogout" to="/logout">
              Logout
            </NavLink>
          )}


        </div>
      </div>
    </nav>
  );
};

export default NavBar;
