// Action Types
import { GET_FEEDBACK, CLEAR_FEEDBACK } from '../actions/types';

const initialState = '';

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_FEEDBACK:
      return action.payload;

    case CLEAR_FEEDBACK:
      return '';

    default:
      return state;
  }
}
