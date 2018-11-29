const mongoose = require('mongoose');
const Event = require('./event');
var ObjectId = require('mongodb').ObjectID

// Company Schema
const CompanySchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    team: [{
        username: {
            type: String
        },

        isAdmin: {
            type: Boolean,
            default: false
        },

        isOwner: {
            type: Boolean,
            default: false
        }
    }],

    events: [{
        eventID: mongoose.Schema.Types.ObjectId,

        type: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        date: {
            type: String,
            required: true
        },

        status: String,

        storage: String,

        price: String,

        notes: String,

        assignedTo: String
    }]
});

const Company = module.exports = mongoose.model('Company', CompanySchema);


// Get company by ID
module.exports.getCompanyById = function (id, callback) {
    Company.findById(id, callback);
}

module.exports.getAllUserCompanies = function (username, callback){

    var query = {
        "team.username" : username
    };

    Company.find(query, callback);
}


// Add Comapny
module.exports.addCompany = function (newCompany, callback) {
    Company.create(newCompany, callback);
}


// Add team member
module.exports.addTeamMember = function (id, newTeamMember, callback) {
    var query = {_id: id};

    Company.findOneAndUpdate(query, {$push: {team: newTeamMember}}, callback);
}


// DELETE
module.exports.removeCompany = function (id, callback) {
    var query = {_id: id};
    Company.remove(query, callback);
}



////////////////////////////////////////////////



// Add EVENT
module.exports.addEvent = function (companyID, newEvent, callback) {
    var query = {_id: companyID};

    Company.findOneAndUpdate(query, {$push: {events: newEvent}}, callback);
}


// Get all events by a company
module.exports.getAllEventsByCompany = function (companyID, callback) {
    Company.findById(companyID, callback);
}


// GET all events where status is complete
module.exports.getAllCompletedEvents = function (username, callback){

    var query = {
        "events.status" : "Complete"
    };

    Company.find(query, callback);
}


// Get an event
module.exports.getEvent = function (eventID, callback) {

    var query = {
        "events.eventID" : eventID
    };

    Company.findById(query, callback);
}
