// eslint-disable-next-line camelcase
const check_valid_string = require('../helpers/verify_ds').validateString;
// eslint-disable-next-line camelcase
const check_valid_integer = require('../helpers/verify_ds').validateInteger;
const mappings = require('../helpers/lang_mappings');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const checkSingleFilePost = (expectedClassName, incomingPost) => {
  const errors = [];

  const keys = Object.keys(incomingPost);
  keys.forEach((key) => {
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
  if (!expectedLanguage.includes(incomingPost['language'])) {
    errors.push('Languages do not match up');
  }

  let s3 = new AWS.S3();
  const params = {Bucket: process.env.S3_BUCKET_NAME, Key: incomingPost['file_name']};
  s3.getObject(params, function(err) {
      if (err) {
          errors.push(err);
      }
  });


  return errors;
};


module.exports = {
  checkSingleFilePost,
};
