var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Company = require("../models/company");
var Event = require("../models/event");

const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

var path = require("path");


router.get("/:type/:name/:date", ensureAuthenticated, function(req, res) {

    var query = { "events" : {
            "$elemMatch": {
                "type": req.params.type,
                "name": req.params.name,
                "date": req.params.date
            }
        }
    };

    Event.find(query, { 'events.$': 1 })
        .populate("company")
        .exec()
        .then(doc => {
            res.render("edit", {
                event: doc[0].events[0],
                team: doc[0].company.team
            });

            //console.log(doc[0].events[0]);
            //console.log(doc[0].company.team);
        })


        .catch(err => {
            console.log("Error " + err);
        });
});

router.post("/", ensureAuthenticated, function (req, res) {

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

});

router.get("/delete/:company/:type/:name/:date", ensureAuthenticated, function (req, res) {
    console.log(req.params.name);
    Event.update({company: ObjectId(req.params.company)}, { $pull: { 'events': { 'type': req.params.type, 'name': req.params.name, 'date': req.params.date } } }, function (err, doc) {

        if(err){
            res.status(404);
            res.json({success: false});
            console.log(err);

        } else {
            res.json({
                success: true
            });

            console.log("Success " + doc);
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

module.exports = router;
