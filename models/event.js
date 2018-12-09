const mongoose = require('mongoose');

// User Schema
const eventSchema = mongoose.Schema({

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },

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

const Event = module.exports = mongoose.model('Event', eventSchema);

// Get events
module.exports.getEvents = function (callback, limit) {
    Event.find(callback).limit(limit);
}


// Get an event
module.exports.getEvent = function (eventID, callback) {

    var query = {
        "events._id" : eventID
    };

    Event.find(query, { 'events.$': 1 }, callback);
}


// Get all events by a company
module.exports.getAllEventsByCompany = function (companyID, callback) {
    var query = {company: companyID};
    Event.find(query, callback);
}


// Add Comapny
module.exports.addCompany = function (newCompany, callback) {
    var query = {company: newCompany};
    Event.create(query, callback);
}

// Add Event
module.exports.addEvent = function (companyID, newEvent, callback) {
    var query = {company: companyID};
    Event.findOneAndUpdate(query, {$push: {events: newEvent}}, callback);
}



module.exports.updateEvent = function(data, callback) {

    var query = {
        "events.type" : data.originalType,
        "events.name": data.originalName,
        "events.date": data.originalDate
    };

    var updateEvent = { $set: {
            "events.$.type": data.type,
            "events.$.name": data.name,
            "events.$.date": data.date,
            "events.$.status": data.status,
            "events.$.storage": data.storage,
            "events.$.notes": data.notes,
            "events.$.assignedTo": data.assignedTo
        }
    };

    Event.update(query, updateEvent, callback);
};


// DELETE
module.exports.removeEvent = function (id, callback) {
    var query = {_id: id};
    Event.remove(query, callback);
}
