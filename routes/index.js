/*
Example of routes: 

POST /api/cs385/execute 
GET /api/cs385/retrieve/:id
POST /api/cs115/execute
GET /api/cs115/retrieve/:id
POST /api/cs285/execute
GET /api/cs285/retrieve/:id
POST /api/cs496/execute
GET /api/cs496/retrieve/:id


Post data to send:

{ 
    "class": "cs385",
    "time_limit": "10000",          **in milliseconds**
    "memory_limit": "65536",        **in bytes**
    "submission_file": "<LINK TO AWS S3>",
    "test_file": "<LINK TO AWS S3>"
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
