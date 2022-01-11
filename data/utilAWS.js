const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const fs = require('fs');
const join = require('path').join;
const s3Zip = require('s3-zip');

const retrieveFile = async(fileName) => {
  let s3 = new AWS.S3();
  const fileParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
  };

  try {
    const fileResponse = await s3.getObject(fileParams).promise();
    const file = fileResponse.Body;
    return {
        'file': file,
    };
  } catch (e) {
      console.log(fileParams.Key);
      return {
          'error': e,
      };
  }
};

const retrieveZip = (fileName) => {
    /* 
    This does another zip on top of the file it's retrieving.
    So if we are getting a zip file, it zips up the zip file.
    Need to find another, better way for downloading zips from AWS.
    We also need to implement error checking
    */
    const output = fs.createWriteStream(join('./', fileName));
    try {
        s3Zip.archive({
            region: process.env.S3_BUCKET_REGION,
            bucket: process.env.S3_BUCKET_NAME,
        }, '', [fileName]).pipe(output);

        return {
            'message': 'Successful download',
        };
    } catch (e) {
        return {
            'error': e,
        };
    }
};

module.exports = {
    retrieveFile,
    retrieveZip,
};