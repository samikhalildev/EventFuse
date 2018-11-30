var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var path = require("path");

var Company = require("../models/company");
var User = require("../models/user");
var Event = require("../models/event");


router.get("/", ensureAuthenticated, function(req, res) {

    Company.getAllUserCompanies(user.username, function (err, companies) {

        if(err)
            return console.log("An error occured: " + err);

        res.render("manager", {
            companies: companies,
        });
    });
});


router.post("/create", ensureAuthenticated, function (req, res) {

    var newCompany = new Company({
        name: req.body.name,
        team: {
            username: user.username,
            isAdmin: true,
            isOwner: true
        }
    });

    Company.addCompany(newCompany, function (err, company) {

        if(err)
            return console.log("An error occured: " + err);

        console.log("Company created: " + company);
    });

    res.render("manager");

});


router.post("/addTeam/:_id", ensureAuthenticated, function (req, res) {

    var newTeamMember = {"username": req.body.name, "isAdmin": true, "isOwner": false};
    var companyID = req.params._id;

    Company.addTeamMember(companyID, newTeamMember, function (err, company) {

        if(err)
            return console.log("An error occured: " + err);

        console.log("Team member added: " + company);

    });

    res.redirect("/manager");

});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in!');
		res.redirect('/users/login');
	}
}

module.exports = router;
