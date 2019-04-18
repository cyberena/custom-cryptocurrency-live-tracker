import { combineReducers } from 'redux';
import userReducer from './users.reducer';
import tickersReducer from './tickers.reducer';

const rootReducer = combineReducers({
    userReducer,
    tickersReducer
});
  
  export default rootReducer;