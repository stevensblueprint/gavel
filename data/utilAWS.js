const AWS = require('aws-sdk');
const config = {
    apiVersion: 'latest',
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_BUCKET_REGION,
};


AWS.config.update(config);
const fs = require('fs');
const unzipper = require('unzipper');

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


const retrieveFileFromZip = async(fileName, fileNumber, desiredFileName) => {
    let s3 = new AWS.S3();
    const dir = await unzipper.Open.s3(s3, {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
    });
    
    return new Promise( (resolve) => {
        dir.files[fileNumber]
        .stream()
        .pipe(fs.createWriteStream(desiredFileName))
        .on('finish',resolve);
    }).catch((e) => {
        if (e instanceof TypeError) {
            return {
                'noMoreFiles': 'Reached end of zip file.',
            };
        } else {
            return {
                'error': e.toString(),
            };
        }
    });
};

module.exports = {
    retrieveFile,
    retrieveFileFromZip,
};