import http from "./httpServices";

const apiEndpoint = "http://18.221.49.186:3900/api/tickers/";

export async function getAllTickers(userID) {
  return await http.get(apiEndpoint + userID);
}

export async function updateTickers(userID) {
  return await http.get(apiEndpoint + "update/" + userID);
}


export default {
    getAllTickers: getAllTickers
};

