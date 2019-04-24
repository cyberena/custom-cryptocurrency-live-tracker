import update from 'react-addons-update';

const tickersInitialState = {
    arbitrage: [],
    data: [],
    tickers: null,
    updateClass: "normal",
    user: "",
    loadingStatus: "Loading..."
  };
  
export default function tickersReducer(state = tickersInitialState, action) {
console.log(action);
    switch (action.type) {
      case "SET_ARBITRAGE":
        return Object.assign({}, state, {
          arbitrage: action.arbitrage
        })
      break;
      case "SET_TICKERS":
        return Object.assign({}, state, {
          tickers: action.tickers,
          updateClass: "normal"
        })
      break;
      case "UPDATE_CLASS":
        return Object.assign({}, state, {
          updateClass: action.updateClass
        })
      break;
      case "UPDATE_ONE_TICKER":
        return update(state, {
            tickers: {
                [action.matchIndex]: {$set: action.newTicker}
            },
            updateClass: { $set: "glow" }, 
            loadingStatus: { $set: "" }
        });
      break;
      default:
        return state;
      break;
    }
  }
  