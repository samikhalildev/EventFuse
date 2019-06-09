import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import {
  SET_CURRENT_USER,
  GET_ERRORS,
  CLEAR_ERRORS,
  SET_USER_EMAIL,
  GET_FEEDBACK,
  SET_LOADING,
  CLEAR_LOADING
} from './types';

// Register
export const registerUser = (userData, history) => dispatch => {
  dispatch(setLoading());

  axios
    .post('/api/users/register', userData)
    .then(res => {
      // if success, redirect to the account page
      dispatch({
        type: SET_USER_EMAIL,
        payload: userData.email
      });

      dispatch({
        type: GET_FEEDBACK,
        payload: 'You have successfully registered, please login.'
      });
      dispatch(clearLoading());
      history.push(`/login/${userData.email}`);
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      dispatch(clearLoading());
    });
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  dispatch(setLoading());

  axios
    .post('/api/users/login', userData)
    .then(res => {
      // Once we get the response back, save to LocalStorage
      const { token } = res.data;

      // Set token to LocalStorage
      localStorage.setItem('jwtToken', token);

      // Set token to Auth header
      setAuthToken(token);

      // decode token to get user data
      const decoded = jwt_decode(token);

      let payload = {
        user: res.data.user,
        token: decoded
      };

      // Set current user
      dispatch(setCurrentUser(payload));
      dispatch(clearLoading());
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      dispatch(clearLoading());
    });
};

// Set logged in user
export const setCurrentUser = data => {
  return {
    type: SET_CURRENT_USER,
    payload: data
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');

  // Remove account header for future requests
  setAuthToken(false);

  // Set current user to {} which will set isAuthenticate to false
  dispatch(setCurrentUser({}));
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

export const setLoading = () => {
  return {
    type: SET_LOADING
  };
};

export const clearLoading = () => {
  return {
    type: CLEAR_LOADING
  };
};
