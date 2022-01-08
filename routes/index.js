/*
Example of routes: 

POST /api/cs385/execute/batch           * Given a zip file, unzip and execute test script on all files *
POST /api/cs385/execute/single-test     * Given a single file, execute test script * 
POST /api/cs385/execute/single-file     * Given a single file, execute it *
GET /api/cs385/retrieve/:id             * Retrieve the test script *


Post data to send for /execute/single-test:

{ 
    "class": "cs385",
    "language": "cpp",
    "time_limit": "10000",          **in milliseconds**
    "memory_limit": "65536",        **in bytes**
    "submission_file_name": "<FILE NAME AS AWS S3 KNOWS IT>",
    "test_file_name": "<FILE NAME AS AWS S3 KNOWS IT>"
    "makefile" : "<MAKEFILE AS AWS S3 KNOWS IT>"    **only required for gcc languages**
}

The POST request saves the output of the program to the database and generates
an ID associated with the output. You can retrieve the output using the GET command
*/

const cs115Routes = require('./cs115');
const cs284Routes = require('./cs284');
const cs385Routes = require('./cs385');
const cs496Routes = require('./cs496')


const constructorMethod = (app) => {
  app.use('/api/cs115', cs115Routes);
  app.use('/api/cs284', cs284Routes);
  app.use('/api/cs385', cs385Routes);
  app.use('/api/cs496', cs496Routes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;
