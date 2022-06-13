const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const googleResultObject = require("./google_scraper");
const bingResultObject = require("./bing_scraper");

const app = express();
const PORT = 8080;

// CORS middleware 
// - for calling the API from different locations by hitting endpoints in browser
app.use(cors());

// configs for body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (request, response) => {
  response.send("Hello World");
});

// get route for google search result object
app.get("/googleSearch", async (request, response) => {
  // call to scraper function
  const googleResultObjectCode = (
    (await googleResultObject(request.searchQuery, request.pLanguage, request.linkState) || "Search Failed")
  );
  
  // code object from corresponding linkstate website from google search result object to json
  response.json({ googleResultObjectCode });
});

// get route for bing search result object
app.get("/bingSearch", async (request, response) => {
  // call to scraper function
  const bingResultObjectCode = (
    (await bingResultObject(request.query.searchQuery, request.query.pLanguage, request.linkState) || "Search Failed")
  );
  
  // code object from corresponding linkstate website from bing search result object to json
  response.json({ bingResultObjectCode });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});

