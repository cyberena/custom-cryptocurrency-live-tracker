import http from "./httpServices";

const apiEndpoint = "http://18.221.49.186:3900/api/users";

export function register(user) {
  return http.post(apiEndpoint, {
    email: user.email,
    password: user.password,
    name: user.name
  });
}

export function updateUser(user) {
  console.log("update user in userservce");
  return http.post(apiEndpoint + "/update", {
    email: user.email,
    password: user.password,
    name: user.name
  });
}

export default register;

