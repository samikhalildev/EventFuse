import {
  GET_COMPANIES,
  ADD_EVENT,
  GET_EVENTS,
  EDIT_EVENT,
  DELETE_EVENT,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_FEEDBACK,
  CLEAR_FEEDBACK,
  SET_LOADING,
  CLEAR_LOADING,
  ADD_COMPANY,
  SEARCH_EVENTS
} from './types';
import axios from 'axios';

export const getCompaniesByUser = () => dispatch => {
  dispatch(setLoading());
  axios
    .get(`/api/companies`)
    .then(res => {
      dispatch({
        type: GET_COMPANIES,
        payload: res.data.companies
      });

      dispatch(clearLoading());
    })
    .catch(err => {
      console.log('err', err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      dispatch(clearLoading());
    });
};

export const addCompany = data => dispatch => {
  dispatch(setLoading());
  axios
    .post(`/api/companies`, data)
    .then(res => {
      console.log(res.data);

      dispatch({
        type: ADD_COMPANY,
        payload: res.data.companies
      });

      dispatch(clearLoading());
    })
    .catch(err => {
      console.log('err', err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      dispatch(clearLoading());
    });
};

export const addEvent = (data, companyID, index) => dispatch => {
  dispatch(setLoading());
  axios
    .post(`/api/events/${companyID}`, data)
    .then(res => {
      console.log(res.data);

      dispatch({
        type: ADD_EVENT,
        payload: {
          company: res.data.company,
          index
        }
      });

      dispatch(clearLoading());
    })
    .catch(err => {
      console.log('err', err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      dispatch(clearLoading());
    });
};

export const editEvent = (event, index) => dispatch => {
  dispatch(setLoading());
  axios
    .put(`/api/events/${event._id}`, event)
    .then(res => {
      console.log(res.data);

      dispatch({
        type: EDIT_EVENT,
        payload: {
          company: res.data.company,
          index
        }
      });

      dispatch(clearLoading());
    })
    .catch(err => {
      console.log('err', err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      dispatch(clearLoading());
    });
};

export const deleteEvent = (event, index) => dispatch => {
  dispatch(setLoading());
  axios
    .delete(`/api/events/${event._id}`, event)
    .then(res => {
      dispatch({
        type: DELETE_EVENT,
        payload: {
          event,
          index
        }
      });

      dispatch(clearLoading());
    })
    .catch(err => {
      console.log('err', err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      dispatch(clearLoading());
    });
};

export const searchEvents = (query, index) => {
  return {
    type: SEARCH_EVENTS,
    payload: {
      query,
      index
    }
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
