import React, { Component } from 'react'
import M from 'materialize-css';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            user: {},
            companies: [],
            events: [],
            isEditing: [],
            newEvent: {}
        }
    }

    componentDidMount() {
        M.AutoInit();
    }

    render() {
        const { user, events, isEditing, newEvent, companies } = this.state;
        const { auth, success_msg, error_msg } = this.props;

        console.log(auth);

        return (
            <section className="box">
                <div className="container">
                    <div className="row">
                        <div className="col s12">
                            <div id="events">
                                <h2 className="heading"> Dashboard </h2>

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
                                        <select className="selectCompany">
                                            { companies.map(company => {
                                                return <option value={company.id}> {company.name} </option>
                                            })}
                                        </select>
                                        
                                            { companies ? 
                                                <label className="selectCompanyLabel">Select a company</label>
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
                                    { companies ? (
                                        <a className="waves-effect waves-light btn-large button-secondary modal-trigger" href="#add-event-modal">
                                            <i className="material-icons left">add</i>
                                            <span> Add Event </span>
                                        </a>
                                    ) : (
                                        <a className="waves-effect waves-light btn-large button-secondary modal-trigger disabled" href="#add-event-modal">
                                            <i className="material-icons left">add</i>
                                            <span> Add Event </span>
                                        </a>
                                    )}
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
                                                    <option value="None" disabled selected>Choose an option</option>
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
                                                <label for="name">Name <span className="requiredField">*</span></label>
                                            </div>

                                            {/* Date */}
                                            <div className="input-field col s4">
                                                <input name="date" id="date" type="text" className="datepicker" required="" aria-required="true"/>
                                                <label for="date">Date <span className="requiredField">*</span></label>
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
                                                <label for="storage">Storage</label>
                                            </div>

                                            {/* Price Slider */}
                                            <div style={{display: 'none'}} className="input-field col s12 priceSection">
                                                <label className="priceLabel">Price $<span id="price"></span> </label>
                                                <div onmouseup="" id="priceSlider"></div>
                                            </div>

                                            {/* Notes */}
                                            <div className="input-field col s6 notesField">
                                                <textarea name="notes" id="notes" className="materialize-textarea"></textarea>
                                                <label for="notes">Notes (additional info/song requests)</label>
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
                                                <input id="search" type="search" required/>
                                                <label className="label-icon" for="search"><i className="material-icons">search</i></label>
                                            </div>
                                        </form>
                                    </div>
                                </nav>

                                <div id="loadingSearchElement" className="progress">
                                    <div className="indeterminate"></div>
                                </div>

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
                                                <th scope="col" colspan="2" className="w100"><i className="material-icons previx">settings</i></th>
                                            </tr>
                                        </thead>

                                        {!companies ? (
                                            <tr>
                                                <td className="small success-msg" colspan="9" aria-colspan="9"> Welcome {user.name}! <br/> Let's get started by creating a company in your manager 💻 🔝</td>
                                            </tr>
                                       ) : null}

                                        <tbody className="list" id="table-data">
                                            { events.length > 0 ? events.map((event, index) => {
                                                return (
                                                    isEditing[index] ? (
                                                        <td> <input type="text" name="name" id="name" /></td>
                                                    ) : (
                                                        <td> {event.name} </td>
                                                    )
                                                )
                                            }) : (
                                                <p>No events</p>
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
    errors: state.errors,
    loading: state.loading
  });
  
  export default connect(
    mapStateToProps,
    { }
  )(withRouter(Dashboard));
  