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
  let index;

  switch (action.type) {
    case GET_COMPANIES:
      return {
        ...state,
        companies: action.payload
      };

    case ADD_EVENT:
      let { company } = action.payload;
      index = action.payload.index;
      console.log(company);

      let companies = state.companies;
      companies[index] = company;
      console.log(companies);

      return {
        companies,
        eventsSearchList: []
      };

    case SEARCH_EVENTS:
      let { query } = action.payload;
      index = action.payload.index;

      query = query.toLowerCase().trim();

      let searchList = state.companies[index].events.filter(event => {
        if (
          event.type.toLowerCase().includes(query) ||
          event.name.toLowerCase().includes(query) ||
          (event.date && event.date.toLowerCase().includes(query)) ||
          (event.status && event.status.toLowerCase().includes(query)) ||
          (event.storage && event.storage.toLowerCase().includes(query)) ||
          (event.assignedTo && event.assignedTo.toLowerCase().includes(query))
        )
          return event;
      });

      return {
        ...state,
        eventsSearchList: searchList
      };

    case DELETE_EVENT:
      let { event } = action.payload;
      index = action.payload.index;

      let updatedEvents = state.companies[index].events.filter(
        e => e._id !== event._id
      );

      let comp = state.companies;
      comp[index].events = updatedEvents;

      console.log('updated', comp);

      return {
        companies: comp,
        eventsSearchList: []
      };

    default:
      return state;
  }
}
