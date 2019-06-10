var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');

var db_URI = process.env.MONGODB_URI || 'mongodb://localhost/eventhub';
mongoose.connect(db_URI);
mongoose.connection;

// Store the routes for each page
var users = require('./backend/API/users');
var companies = require('./backend/API/companies');
var events = require('./backend/API/events');
var manager = require('./backend/API/manager');
var edit = require('./backend/API/edit');

var editDetails = require('./backend/API/editDetails');
var changePassword = require('./backend/API/changePassword');
// store routes here

// Init App
var app = express();

// View Engine
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(
  session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
  })
);

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');

  user = req.user || null;
  res.locals.user = user;

  next();
});

//when a url path is requested, call the router for that page
app.use('/api/users', users);
app.use('/api/companies', companies);
app.use('/api/events', events);

app.use('/manager', manager);

app.use('/editDetails', editDetails);
app.use('/changePassword', changePassword);
app.use('/edit', edit);
//add path to a route here

// Set Port
app.set('port', process.env.PORT || 8000);

app.listen(app.get('port'), function() {
  console.log('Server started on port ' + app.get('port'));
});
