const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

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
      return {
          'error': e,
      };
  }
  
};

module.exports = {
    retrieveFile,
};