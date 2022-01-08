// eslint-disable-next-line camelcase
const check_valid_string = require('../helpers/verify_ds').validateString;
// eslint-disable-next-line camelcase
const check_valid_integer = require('../helpers/verify_ds').validateInteger;
const mappings = require('../helpers/lang_mappings');


const checkSingleFilePost = (expectedClassName, incomingPost) => {
  const errors = [];

  const keys = Object.keys(incomingPost);
  keys.forEach((key, _) => {
    if (!check_valid_string(incomingPost[key])) {
      errors.push(key + ' is not a proper string.');
    }
    if (key == 'time_limit' || key == 'memory_limit') {
      if (!check_valid_integer(incomingPost[key])) {
        errors.push('The value for ' + key + ' does not parse to an integer,');
      }
    }
  });

  if (expectedClassName !== incomingPost['class']) {
    errors.push('Class names do not match up.');
  }

  const expectedLanguage = mappings[incomingPost['class']];
  if (!incomingPost['language'] in expectedLanguage) {
    errors.push('Languages do not match up');
  }


  return errors;
};


module.exports = {
  checkSingleFilePost,
};
