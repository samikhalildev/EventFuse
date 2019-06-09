const mongoose = require('mongoose');

// User Schema
const eventSchema = mongoose.Schema({

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

});

const Event = module.exports = mongoose.model('Event', eventSchema);


// Get an event
module.exports.getEvent = function (eventID, callback) {
    Event.findById({_id: eventID}, callback);
}


// Get all events by a company
module.exports.getAllEventsByCompany = function (companyID, callback) {
    var query = {company: companyID};
    Event.find(query, callback);
}



// Create Event
module.exports.addEvent = function (newEvent, callback) {
    Event.create(newEvent, callback);
}



module.exports.updateEvent = function(eventID, data, callback) {

    var query = {_id: eventID};

    var updateEvent = { $set: {
            type: data.type,
            name: data.name,
            date: data.date,
            status: data.status,
            storage: data.storage,
            notes: data.notes,
            assignedTo: data.assignedTo
        }
    };

    Event.findOneAndUpdate(query, updateEvent, callback);
};


// DELETE
module.exports.removeEvent = function (id, callback) {
    var query = {_id: id};
    Event.remove(query, callback);
}
