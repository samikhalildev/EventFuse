const Validator = require('validator');
const isEmpty = require('./isEmpty');

const validateEvent = data => {
  let errors = {};

  data.type = isEmpty(data.type) ? '' : data.type;
  data.name = isEmpty(data.name) ? '' : data.name;

  if (Validator.isEmpty(data.type)) {
    errors.type = 'Type field is required';
  }

  if (!Validator.isLength(data.name, { min: 3, max: 30 })) {
    errors.name = 'name must be at least 3 characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateEvent;
