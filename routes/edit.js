var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Company = require("../models/company");
var Event = require("../models/event");

const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

var path = require("path");


router.get("/:companyID/:eventID", ensureAuthenticated, function(req, res) {

    let companyID = req.params.companyID;
    let eventID = req.params.eventID;

    User.getUserCompanies(user._id, function (err, user) {

       if(err)
           throw err;

       if(isMatch(user.companies, companyID)){

           Company.getCompanyById(companyID, function (err, company) {

               if(err)
                   throw err;

               if(isMatch(company.events, eventID)){

                   Event.getEvent(eventID, function (err, event) {

                       if(err)
                           throw err;

                       console.log(event);

                       res.render("edit", {
                           event: event,
                           team: company.team
                       });

                   });

               } else {
                   redirectWithError(res)
               }

           });

       } else {
            redirectWithError(res)
       }
    });
});



router.post("/", ensureAuthenticated, function (req, res) {

    Event.updateEvent(req.body.eventID, req.body, function (err, doc) {
        if(err)
            throw err;

        Company.getAllUserCompanies(user.username, function (err, companies) {

            if(err){
                return console.log("error");
            }

            res.render("dashboard", {companies: companies, eventUpdated: req.body.eventID, success_msg: "Event has been updated."});
        });

    });
    /*
    var query = {
        "events.type" : req.body.originalType,
        "events.name": req.body.originalName,
        "events.date": req.body.originalDate
    };


    var data = { $set: {
            "events.$[i].type": req.body.type,
            "events.$[i].name": req.body.name,
            "events.$[i].date": req.body.date,
            "events.$[i].status": req.body.status,
            "events.$[i].storage": req.body.storage,
            "events.$[i].notes": req.body.notes,
            "events.$[i].assignedTo": req.body.assignedTo
        }
    };

    var filter = {
        arrayFilters: [
            { $and: [
                    {"i.type": req.body.originalType},
                    {"i.name": req.body.originalName},
                    {"i.date": req.body.originalDate}
                ]
            }
        ]
    };

    console.log(data);

    Event.update(query, data, filter, function (err, doc) {

        if(err)
            return console.log("ERROR: " + err);

        console.log("updated " + doc);


        Company.getAllUserCompanies(user.username, function (err, companies) {

            if(err){
                return console.log("error");
            }

            res.render("dashboard", {companies: companies, justUpdated: true});

        });
    });
    */

});

// DELETE event
router.get("/delete/:companyID/:eventID", ensureAuthenticated, function (req, res) {

    let companyID = req.params.companyID;
    let eventID = req.params.eventID;

    User.getUserCompanies(user._id, function (err, user) {

        if(err)
            throw err;

        if(isMatch(user.companies, companyID)){

            Company.getEvent(companyID, eventID, function (err, event) {

                if(err)
                    throw err;

                Event.removeEvent(eventID, function (err, doc) {

                    if(err){
                        res.status(404);
                        res.json({success: false});
                        console.log(err);

                    } else {
                        Company.removeEventFromCompany(companyID, eventID, function (err, done) {

                            if(err)
                                throw err;

                            res.json({
                                success: true
                            });

                        });
                    }
                });
            });
        }
    });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','You are not logged in 🔑');
        res.redirect('/users/login');
    }
}

function isMatch(search,query) {
    for(var i = 0; i < search.length ; i++) {
        if(search[i].toString() == query.toString())
            return true;
    }
    return false;
}

function redirectWithError(res){
    Company.getAllUserCompanies(user.username, function (err, companies) {

        if(err)
            throw err;

        res.render("dashboard", {
            error_msg: "Error: Trying to access unauthorised event.",
            companies: companies
        });
    });
}

module.exports = router;
