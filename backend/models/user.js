var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String
  },

  checkins: {
    type: Number
  },

  selectedCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },

  companies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    }
  ]
});

var User = (module.exports = mongoose.model('User', UserSchema));

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.createUser_invite = function(newUser, callback) {
  User.create(newUser, callback);
};

module.exports.userRegistration_invite = function(newUser, userID, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;

      query = {
        $set: {
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          password: newUser.password
        }
      };

      User.findOneAndUpdate({ _id: userID }, query, { new: true }, callback);
    });
  });
};

module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByNameAndId = function(name, id, callback) {
  var query = { username: name, _id: { $ne: id } };
  User.findOne(query, callback);
};

module.exports.getUserByEmailAndId = function(email, id, callback) {
  var query = { email: email, _id: { $ne: id } };
  User.findOne(query, callback);
};

module.exports.updateUser = function(updateUser, id, callback) {
  var username = updateUser.username;
  var email = updateUser.email;
  var name = updateUser.name;

  query = {
    $set: {
      email,
      username,
      name,
      bio,
      specialty
    }
  };
  User.findOneAndUpdate({ _id: id }, query, { new: true }, callback);
};

module.exports.updatePassword = function(id, password, callback) {
  var query = null;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      password = hash;
      query = { $set: { password } };
      User.findOneAndUpdate({ _id: id }, query, { new: true }, callback);
    });
  });
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports.addCompanyToUser = function(userID, companyID, callback) {
  var query = { _id: userID };
  User.findOneAndUpdate(query, { $push: { companies: companyID } }, callback);
};

// Get company by ID
module.exports.getUserCompanies = function(userID, callback) {
  User.findById(userID, callback);
};
