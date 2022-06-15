const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080;
 
// CORS middleware
// - for calling the API from different locations by hitting endpoints in browser
app.use(cors());

// configs for body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// import routes here

app.get("/", (request, response) => {
  response.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});

// module.exports = router;
