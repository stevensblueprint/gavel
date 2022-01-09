const express = require('express');
require('dotenv').config({path: '.env'});
const app = express();
const configRoutes = require('./routes');
app.use(express.json());
configRoutes(app);

app.listen(3000, () => {
   console.log('Gavel is running on Port 3000');
});