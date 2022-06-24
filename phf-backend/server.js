const googleResultObject = require("./scrapers/google_scraper");
const bingResultObject = require("./scrapers/bing_scraper");
const express = require("express");
const app = express();
const PORT = 8080;

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
  var stateChoice = request.params.ls;

  // call to scraper function
  const results =
    (await googleResultObject.getResultDataLinks(
      searchQuery,
      languageChoice,
      stateChoice,
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
  
  //const results = await bingResultObject.fetchFirstBingResultPage(searchQuery, languageChoice);

  // code object from corresponding linkstate website from bing search result object to json
  response.send(results);
});

// route doesn't exist 
app.use(function (request, response, next) {
  response.status(404).send("Not found");
});

// start at port
app.listen(PORT, function () {
  console.log(`Server started on ${PORT}`);
});