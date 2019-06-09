// Action Types
import { SET_LOADING, CLEAR_LOADING } from '../actions/types';

const loading = false;

export default function(state = loading, action) {
  switch (action.type) {
    case SET_LOADING:
      return true;

    case CLEAR_LOADING:
      return false;

    default:
      return state;
  }
}
