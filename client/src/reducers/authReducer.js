// Action Types
import { SET_CURRENT_USER, SET_USER_EMAIL } from '../actions/types';

import isEmpty from '../utils/isEmpty';

// This will be the state for this reducer when the application starts up
const initialState = {
  isAuthenticated: false,
  user: {}
};

// A reducer exports a function which takes the current state and an action
export default function(state = initialState, action) {
  // Depending on the action type, the reducer will update the store
  // The data passed in can be accessed via action.payload
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };

    case SET_USER_EMAIL:
      return {
        ...state,
        user: action.payload
      };

    default:
      return state;
  }
}
