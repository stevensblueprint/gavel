// eslint-disable-next-line camelcase
const check_valid_string = require('../helpers/verify_ds').validateString;
// eslint-disable-next-line camelcase
const check_valid_integer = require('../helpers/verify_ds').validateInteger;
const mappings = require('../helpers/lang_mappings');
const aws = require('../data/utilAWS');
const AWS = require('aws-sdk');

const config = {
    apiVersion: 'latest',
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_BUCKET_REGION,
};

AWS.config.update(config);
console.log('here');
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

const checkFileAndTestPost = (expectedClassName, incomingPost) => {
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
  const fileParams = {Bucket: process.env.S3_BUCKET_NAME, Key: incomingPost['file_name']};
  s3.getObject(fileParams, function(err) {
      if (err) {
          errors.push(err);
      }
  });
  
  const testParams = {Bucket: process.env.S3_BUCKET_NAME, Key: incomingPost['test_file_name']};
  s3.getObject(testParams, function(err) {
      if (err) {
          errors.push(err);
      }
  });
  
  return errors;
};

const checkBatchPost = async(expectedClassName, incomingPost) => {
    const errors = [];

    const keys = Object.keys(incomingPost);
    keys.forEach((key) => {
      if (!check_valid_string(incomingPost[key])) {
        errors.push(key + ' is not a proper string.');
      }
      if (key == 'time_limit' || key == 'memory_limit' || key == 'zip_level') {
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

    let files = incomingPost.extra_files.split(',');
    files.push(incomingPost.file_name);
    files.push(incomingPost.test_file_name);

    for (let file of files) {
        const getFile = await aws.retrieveFile(file);
        if (getFile.error) {
            errors.push(getFile.error);
        }
    }

};

module.exports = {
  checkSingleFilePost,
  checkFileAndTestPost,
  checkBatchPost,
};
