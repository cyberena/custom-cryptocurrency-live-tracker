const userInitialState = {
    user: ""
  };
  
export default function userReducer(state = userInitialState, action) {
console.log(action);
  switch (action.type) {
      case "SET_USER":
        return Object.assign({}, state, {
          user: action.user
        })
      default:
        return state;
    }
  }
  