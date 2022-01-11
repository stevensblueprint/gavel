const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const fs = require('fs');
const join = require('path').join;
const s3Zip = require('s3-zip');
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
        console.log(e);
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
    retrieveZip,
    retrieveFileFromZip,
};