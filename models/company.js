const mongoose = require('mongoose');
const Event = require('./event');

// Company Schema
const companySchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    team: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
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

    event: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

const Company = module.exports = mongoose.model('Company', companySchema);

