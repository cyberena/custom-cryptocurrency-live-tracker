import auth from "../services/authServices";

const LogOut = () => {
  auth.logout();
  window.location = "/";
};

export default LogOut;
