/*
 * Combines together all reducers to one big object to the store
 */
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import feedbackReducer from './feedbackReducer';
import loadingReducer from './loadingReducer';
import eventsReducer from './eventsReducer';

// The key is how you can access the state within your components
// If you create a new reducer, you must add it here.
const allReducers = combineReducers({
  auth: authReducer,
  errors: errorReducer,
  feedback: feedbackReducer,
  loading: loadingReducer,
  events: eventsReducer
});

export default allReducers;
