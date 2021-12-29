const express = require('express');
const router = express.Router();
const { request } = require('express');

router.get('/retrieve/:id', (req, res) => {
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