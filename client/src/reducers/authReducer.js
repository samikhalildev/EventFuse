// Action Types
import { SET_CURRENT_USER, SET_USER_EMAIL } from '../actions/types';

import isEmpty from '../utils/isEmpty';

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload.user),
        user: action.payload.user
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
