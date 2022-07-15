const googleResultObject = require("./scrapers/google_scraper");
const bingResultObject = require("./scrapers/bing_scraper");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

// overrides the CORS header that the server has in place with the open wildcard value
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get("/", function (request, response) {
  response.send("Hello World");
});

// testing parameters
app.get("/testing", function (request, response) {
  response.send(googleResultObject.fetchGoogleSearchData(request.query.sq));
});

// google scraper route
app.get("/google", async function (request, response) {
  var searchQuery = request.query.sq;
  var languageChoice = request.query.lang;
  var stateChoice = request.query.ls;

  // call to scraper function
  const results =
    (await googleResultObject.getResultDataLinks(
      searchQuery,
      languageChoice,
      stateChoice
    )) || "Search Failed"; 

  // code object from corresponding linkstate website from google search result object to json
  response.send(results);
});

// bing scraper route
app.get("/bing", async function (request, response) {
  var searchQuery = request.query.sq;
  var languageChoice = request.query.lang;
  var stateChoice = request.query.ls;

  // call to scraper function
  const results =
    (await bingResultObject.getResultDataLinks(
      searchQuery,
      languageChoice,
      stateChoice
    )) || "Search Failed"; 
  
  // code object from corresponding linkstate website from bing search result object to json
  response.send(results);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('phf-frontend/build'))
}

// route doesn't exist 
app.use(function (request, response, next) {
  response.status(404).send("Not found");
});

// start at port
app.listen(PORT, function () {
  console.log(`Server started on ${PORT}`);
});