import update from 'react-addons-update';

const tickersInitialState = {
    data: [],
    tickers: null,
    updateClass: "normal",
    user: "",
    loadingStatus: "Loading..."
  };
  
export default function tickersReducer(state = tickersInitialState, action) {
console.log(action);
    switch (action.type) {
      case "SET_TICKERS":
        return {
          tickers: action.tickers,
          updateClass: "normal"
        };
        case "UPDATE_CLASS":
        return {
            updateClass: action.updateClass
        };
        case "UPDATE_ONE_TICKER":
    //this.setState({ updateClass: "glow" });
    //this.setState({ loadingStatus: "" });

        return update(state, {
            tickers: {
                [action.matchIndex]: {$set: action.newTicker}
            },
            updateClass: { $set: "glow" }, 
            loadingStatus: { $set: "" }
        });
      default:
        return state;
    }
  }
  