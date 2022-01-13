const express = require('express');
const router = express.Router();
const checkPost = require('../helpers/check_post_info');
const aws = require('../data/utilAWS');

router.post('/execute/single-test', async(req, res) => {
   /*
    POST data should look like this:

    {
        "class": "cs385",
        "language": "cpp",
        "file_name": "<FILE NAME AS AWS S3 KNOWS IT>",
        "test_file_name": "<FILE NAME AS AWS S3 KNOWS IT>"
        "time_limit": "10000",          **in milliseconds**
        "memory_limit": "65536",        **in bytes**
    }
    */
});

router.post('/execute/single-file', async (req, res) => {
      /*
    POST data should look like this:

    {
        "class": "cs385",
        "language": "cpp",
        "compiler": "-g"       ** could also be -03**
        "file_name": "<FILE NAME AS AWS S3 KNOWS IT>",
        "time_limit": "10000",          **in milliseconds**
        "memory_limit": "65536",        **in bytes**
    }
    */
    const postDetails = req.body;
    const errors = checkPost.checkSingleFilePost('cs385', postDetails);
    if (errors.length > 0) {
        return res.json({
            'error': errors,
        });
    }

    const getFile = await aws.retrieveFile(postDetails.file_name);
    if (getFile.error) {
        return res.json({
            'error': getFile.error,
        });
    }

    const file = getFile.file;
    let output = await cppEngine.runSingleFile(file, postDetails);
    res.json(output);

});


module.exports = router;