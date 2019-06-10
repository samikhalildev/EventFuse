import {
  GET_COMPANIES,
  ADD_EVENT,
  GET_EVENTS,
  EDIT_EVENT,
  DELETE_EVENT,
  SEARCH_EVENTS
} from '../actions/types';

const initialState = {
  companies: [],
  eventsSearchList: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_COMPANIES:
      return {
        ...state,
        companies: action.payload
      };

    case ADD_EVENT:
      let { company } = action.payload;
      let i = action.payload.index;

      console.log(company);

      let companies = state.companies;
      companies[i] = company;
      console.log(companies);

      return {
        companies,
        eventsSearchList: []
      };

    case SEARCH_EVENTS:
      let { query, index } = action.payload;
      query = query.toLowerCase().trim();

      let searchList = state.companies[index].events.filter(event => {
        if (
          event.type.toLowerCase().includes(query) ||
          event.name.toLowerCase().includes(query) ||
          event.date.toLowerCase().includes(query) ||
          event.status.toLowerCase().includes(query) ||
          event.storage.toLowerCase().includes(query) ||
          event.assignedTo.toLowerCase().includes(query)
        )
          return event;
      });

      return {
        ...state,
        eventsSearchList: searchList
      };

    default:
      return state;
  }
}
