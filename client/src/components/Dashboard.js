import React, { Component, Fragment } from 'react'
import M from 'materialize-css';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import TextField from './Layout/TextField';
import { getCompaniesByUser, getEventsByCompany, searchEvents } from '../actions/eventActions';
import isEmpty from '../utils/isEmpty';

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            user: {},
            companies: [],
            selectedCompany: {},
            selectedCompanyIndex: '',
            isEditing: [],
            newEvent: {}
        }
    }

    componentDidMount() {
        M.AutoInit();
        this.props.getCompaniesByUser();
    }

    componentDidUpdate() {
        if (isEmpty(this.state.selectedCompany) && this.state.companies.length > 0) {
            this.setState({
                selectedCompany: this.state.companies[0],
                selectedCompanyIndex: 0
            })
        }
    }

    static getDerivedStateFromProps(props, state) {

        if (props.events.eventsSearchList.length > 0) {
            return {
                selectedCompany: {
                    ...state.selectedCompany,
                    events: props.events.eventsSearchList
                }
            }
        }

        return {
            user: props.auth.user,
            companies: props.events.companies
        };
    }

    // Get all the events from the companyID passed in
    getEvents(index) {
        let selectedCompany = this.state.companies[index];

        // if (this.props.events.eventsSearchList) {
        //     let events = this.props.events.eventsSearchList;
        //     if (events.length > 0) {
        //         selectedCompany.events = events;
        //         console.log('updated search', events);
        //     }
        // }

        console.log("Selected company: ", selectedCompany);
        
        let isEditing = new Array(selectedCompany.events.length).fill(false);
        this.setState({ selectedCompany, isEditing, selectedCompanyIndex: index });
    }

    switchToEditingMode(index) {
        let arr = new Array(this.state.selectedCompany.events.length).fill(false);
        arr[index] = true; 
        console.log('edit mode:', this.state.selectedCompany.events[index].name);
        this.state.isEditing = arr;
        this.forceUpdate()
    }

    onChange = event => {
        event.preventDefault();
        let { selectedCompany } = this.state;

        let newUpdates = {
            ...selectedCompany.events,
            [event.target.name]: event.target.value
        }

        selectedCompany.events = newUpdates;

        console.log(newUpdates);
        this.setState({ selectedCompany });
    }

    closeEditingMode() {
        let arr = new Array(this.state.selectedCompany.events.length).fill(false);
        this.state.isEditing = arr;
        this.forceUpdate()
    }

    search = event => {
        event.preventDefault();
        
        let query = event.target.value;
        let index = this.state.selectedCompanyIndex;
        this.props.searchEvents(query, index);

        // setTimeout(() => {
        //     this.getEvents(index);
        // }, 500)
    }

    editEvent(index) {
        //this.props.clearFeedback();

        this.setState({ errors: {} });
        let newEventDetails = this.state.selectedCompany.events[index];
        console.log('Output: editEvent -> newEventDetails', newEventDetails);

        //this.props.editEvent(newEventDetails);
    }

    deleteEvent(index) {
        //this.props.clearFeedback();

        if (window.confirm("Are you sure you want to delete this event?")) {
            let event = this.state.selectedCompany.events[index];
            console.log('Output: deleteEvent -> event', event);
            //this.props.deleteEvent(event);
        }
    }

    render() {
        const { user, selectedCompany, isEditing, companies } = this.state;
        const { auth, loading, success_msg, error_msg } = this.props;

        return (
            <section className="box">
                <div className="container">
                    <div className="row">
                        <div className="col s12">
                            <div id="events">
                                <h2 className="heading"> {selectedCompany.name} </h2>

                                <ul className="alert-box">
                                    { success_msg ? 
                                        <li className="alert success-msg"> {success_msg} </li>
                                    : null }

                                    { error_msg ? 
                                        <li className="alert error-msg"> {error_msg} </li>
                                    : null }
                                </ul>

                                <ul className="alert-box">
                                    <li id="deleteMessage"></li>
                                </ul>

                                {/* Select company */}
                                    <div className="input-field col s2">
                                    { companies ? 
                                        <Fragment>
                                            <a className='dropdown-trigger' href='#' data-target='dropdown1'>Change company</a>
                                            <ul id='dropdown1' className='dropdown-content'>
                                                { companies.map((company, index) => {
                                                    return <li key={index} onClick={() => this.getEvents(index)}><a>{company.name}</a></li>
                                                })}
                                            </ul>
      
                                        </Fragment>
                                    : null }
                                    </div>

                                {/* Search bar
                                <div className="searchBar left">
                                    <div className="input-field s6">
                                        <i className="material-icons prefix">search</i>
                                        <input type="text" id="search-input" className="search">

                                        <label for="search-input">Search</label>
                                        <span className="helper-text"> name or date</span>
                                    </div>
                                </div>

                                <span className="sort small btn" data-sort="type">Sort by type</span>
                                <span className="sort small btn" data-sort="status">Sort by status</span> */}
                            

                                <input type="hidden" id="userID" value={user.id}/>

                                {/* Add Event Button */}
                                <div className="addEventBtn right">
                                    <a className="waves-effect waves-light btn-large button-secondary modal-trigger" href="#add-event-modal">
                                        <i className="material-icons left">add</i>
                                        <span> Add Event </span>
                                    </a>
                                </div>

                                {/* Add Event Form */}
                                <div id="add-event-modal" className="PopUpWindow modal customModal">
                                    <div className="modal-content">
                                        <a href="#!" className="modal-action modal-close">
                                            <i className="material-icons right">close</i>
                                        </a>
                                        <h4 className="PopupHeading">Add Event </h4>

                                        <form id="addEventForm" action="/api/events" method="POST">

                                            {/* Type */}
                                            <div className="input-field col s6">
                                                <select name="type" className="eventTypes">
                                                    <option value="None" disabled defaultValue>Choose an option</option>
                                                    <option value="Wedding">Wedding</option>
                                                    <option value="Engagement">Engagement</option>
                                                    <option value="Holy Communion">Holy Communion</option>
                                                    <option value="Christening">Christening</option>
                                                    <option value="Birthday">Birthday</option>
                                                </select>
                                                <label>Event Type <span className="requiredField">*</span></label>
                                            </div>

                                            {/* Name */}
                                            <div className="input-field col s6">
                                                <input name="name" id="name" type="text" className="validate" required="" aria-required="true"/>
                                                <label htmlFor="name">Name <span className="requiredField">*</span></label>
                                            </div>

                                            {/* Date */}
                                            <div className="input-field col s4">
                                                <input name="date" id="date" type="text" className="datepicker" required="" aria-required="true"/>
                                                <label htmlFor="date">Date <span className="requiredField">*</span></label>
                                            </div>

                                            {/* Status */}
                                            <div className="input-field col s4">
                                                <select name="status" className="status">
                                                    <option className="Missing" value="Missing song">Missing song</option>
                                                    <option className="Ready" value="Ready">Ready</option>
                                                    <option className="Editing" value="Editing">Editing</option>
                                                    <option className="Complete" value="Complete">Complete</option>
                                                    <option className="Waiting" value="Waiting for answer">Waiting for answer</option>
                                                    <option className="Finished" value="Finished">Finished</option>
                                                </select>
                                                <label>Status</label>
                                            </div>

                                            {/* Storage */}
                                            <div className="input-field col s4">
                                                <input name="storage" id="storage" type="text" className="validate"/>
                                                <label htmlFor="storage">Storage</label>
                                            </div>

                                            {/* Price Slider */}
                                            <div style={{display: 'none'}} className="input-field col s12 priceSection">
                                                <label className="priceLabel">Price $<span id="price"></span> </label>
                                                <div id="priceSlider"></div>
                                            </div>

                                            {/* Notes */}
                                            <div className="input-field col s6 notesField">
                                                <textarea name="notes" id="notes" className="materialize-textarea"></textarea>
                                                <label htmlFor="notes">Notes (additional info/song requests)</label>
                                            </div>

                                            {/* Assigned To */}
                                            <div className="input-field col s6">
                                                <select id="teamData" name="assignedTo" className="assignedTo"></select>
                                                <label>Assigned To</label>
                                            </div>


                                            <div className="modal-footer input-field col s12">
                                                <button className="modal-action button-secondary waves-effect waves-light left" type="submit" id="register-btn-submit">
                                                    <span>Submit</span>
                                                </button>

                                                <div className="alert-box">
                                                    <span id="validation"></span>
                                                </div>
                                            </div>

                                        </form>
                                    </div>
                                </div>


                                {/* Delete Event Modal */}
                                <div id="delete-modal" className="modal">
                                    <div className="modal-content">
                                        <h4>Are you sure you would like to delete this event?</h4>
                                    </div>
                                    <div className="modal-footer">
                                        <a href="#!" className="modal-action modal-close waves-effect waves-red btn red lighten-1">Yes</a>
                                        <a href="#!" className="modal-action modal-close waves-effect waves-red btn red lighten-1">No</a>
                                    </div>
                                </div>

                                <nav className="search">
                                    <div className="nav-wrapper">
                                        <form>
                                            <div className="input-field">
                                                <input id="search" type="search" onChange={this.search} required/>
                                                <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                                            </div>
                                        </form>
                                    </div>
                                </nav>

                                { loading ? (
                                    <div id="loadingSearchElement" className="progress">
                                        <div className="indeterminate"></div>
                                    </div>
                                ) : null}

                                {/* EVENTS TABLE */}
                                <div className="tableSection">
                                    <table id="eventsTable" className="table bordered highlight centered responsive-table">
                                        <thead>
                                            <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col" className="w150">Type</th>
                                                <th scope="col" className="w225">Name</th>
                                                <th scope="col" className="w165">Date</th>
                                                {/* <th scope="col">Price</th> */}
                                                {/* Complete: Green, In Progress: yellow, N/A, On hold */}
                                                <th scope="col" className="w165">Status</th>      
                                                <th scope="col" className="w150">Storage</th>
                                                <th scope="col" className="w250">Notes</th>
                                                <th scope="col" className="w100">Assigned to</th>
                                                <th scope="col" colSpan="2" className="w100"><i className="material-icons previx">settings</i></th>
                                            </tr>
                                        </thead>

                                        {!companies ? (
                                            <tr>
                                                <td className="small success-msg" colSpan="9" aria-colspan="9"> Welcome {user.name}! <br/> Let's get started by creating a company in your manager 💻 🔝</td>
                                            </tr>
                                       ) : null}

                                        <tbody className="list" id="table-data">
                                            { selectedCompany.events ? selectedCompany.events.map((event, index) => {
                                                let statusClass = `button-status ${event.status}`;

                                                return (
                                                    isEditing[index] ? (
                                                        <tr key={event._id}>
                                                            <td>
                                                                {index+1}
                                                            </td>

                                                            <td>
                                                                <TextField
                                                                    type='text'
                                                                    name='type'
                                                                    id='type'
                                                                    value={event.type}
                                                                    onChange={this.onChange}
                                                                />
                                                            </td>

                                                            <td>
                                                                <TextField
                                                                    type='text'
                                                                    name='name'
                                                                    id='name'
                                                                    value={event.name}
                                                                    onChange={this.onChange}
                                                                />
                                                            </td>

                                                            <td>
                                                                <TextField
                                                                    type='text'
                                                                    name='date'
                                                                    id='date'
                                                                    value={event.date}
                                                                    onChange={this.onChange}
                                                                />
                                                            </td>

                                                            <td>
                                                                <TextField
                                                                    type='text'
                                                                    name='status'
                                                                    id='status'
                                                                    value={event.status}
                                                                    onChange={this.onChange}
                                                                />
                                                            </td>

                                                            <td>
                                                                <TextField
                                                                    type='text'
                                                                    name='storage'
                                                                    id='storage'
                                                                    value={event.storage}
                                                                    onChange={this.onChange}
                                                                />
                                                            </td>

                                                            <td>
                                                                <TextField
                                                                    type='text'
                                                                    name='notes'
                                                                    id='notes'
                                                                    value={event.notes}
                                                                    onChange={this.onChange}
                                                                />
                                                            </td>

                                                            <td>
                                                                <TextField
                                                                    type='text'
                                                                    name='assignedTo'
                                                                    id='assignedTo'
                                                                    value={event.assignedTo}
                                                                    onChange={this.onChange}
                                                                />
                                                            </td>

                                                            <td>
                                                                <i onClick={() => this.editEvent(index)} className="material-icons pointer">save</i>
                                                            </td>

                                                            <td>
                                                                <i onClick={() => this.closeEditingMode()} className="material-icons pointer">close</i>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        <tr key={event._id} id={event._id}>
                                                            <td scope="row"> {index+1} </td>
                                                            <td className="type"> {event.type}</td>
                                                            <td className="name"> {event.name}</td>
                                                            <td className="date"> {event.date}</td>
                                                            {/* <td className="price"> ${event.price}</td> */}
                                                            <td className="status">
                                                                <button className={statusClass}>
                                                                    {event.status}
                                                                </button> 
                                                            </td>
                                                            <td className="storage"> {event.storage}</td>
                                                            <td className="notes"> {event.notes}</td>
                                                            <td className="assignedTo"> {event.assignedTo}</td>
                                                            <td className=""> 
                                                                <i onClick={() => this.switchToEditingMode(index)} className="material-icons prefix edit pointer">edit</i>
                                                            </td>
                                                            
                                                            <td className=""> 
                                                                <i onClick={() => this.deleteEvent(index)} className="material-icons prefix delete modal-trigger deleteEventBtn pointer">delete</i>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            }) : (
                                                <tr>
                                                    <td className="alert small error-msg" colSpan="9" aria-colspan="9"> You have no events. Click the add event button <span role="img" aria-label="camera">📸</span></td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    events: state.events,
    errors: state.errors,
    loading: state.loading
  });
  
  export default connect(
    mapStateToProps,
    { getCompaniesByUser, getEventsByCompany, searchEvents }
  )(withRouter(Dashboard));
  