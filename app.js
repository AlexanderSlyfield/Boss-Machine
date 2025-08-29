const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();


// Add middleware for handling CORS requests from index.html
app.use(cors())

// Add middware for parsing request bodies here:
app.use(bodyParser.json());

// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require('./server/api');
app.use("/api", apiRouter);



module.exports = app;