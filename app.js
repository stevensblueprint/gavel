const express = require('express');
require('dotenv').config({path: '.env'});
const app = express();
const configRoutes = require('./routes');
app.use(express.json());
configRoutes(app);
const port = 3000;

app.listen(port, () => {
   console.log('Gavel is running on Docker port 3000');
});