const express = require('express');
const router = express.Router();
var AWS = require('aws-sdk')
const { request } = require('express');

AWS.config.update({region: 'us-east-1'});


router.get('/retrieve/:id', async (req, res) => {
    s3 = new AWS.S3();

    // var bucketParams = {
    //     Bucket: 'gavel-test'
    // };
    
    // s3.createBucket(bucketParams, function(err, data) {
    //     if (err) {
    //         console.log("Error", err);
    //     } else {
    //         console.log("Success", data.Location);
    //     }
    // });
    s3.listBuckets(function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
        }
    });  
    const params = {Bucket: 'gavel-test', Key: 'hw6.py'}
    const response = await s3.getObject(params).promise();
    const fileContent = response.Body.toString('utf-8'); 
    console.log(fileContent);
    res.json({
        message: 'Hello World! This is GET!'
    })
});

router.post('/execute', (req, res) => {
    res.json({
        message: 'Hello World! This is POST!'
    })
});

module.exports = router;