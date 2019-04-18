const userInitialState = {
    user: ""
  };
  
export default function userReducer(state = userInitialState, action) {
console.log(action);
  switch (action.type) {
      case "SET_USER":
        return {
          user: action.user
        };
      default:
        return state;
    }
  }
  