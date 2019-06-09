// Action Types
import { LOADING } from '../actions/types';

const loading = false;

export default function(state = loading, action) {
  switch (action.type) {
    case LOADING:
      return action.payload;

    default:
      return state;
  }
}
