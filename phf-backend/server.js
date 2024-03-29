const googleResultObject = require("./scrapers/google_scraper");
const bingResultObject = require("./scrapers/bing_scraper");
const yahooResultObject = require("./scrapers/yahoo_scraper");
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
app.get("/googleresult", async function (request, response) {
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

app.get("/googlelinks", async function (request, response) {
  var searchQuery = request.query.sq;
  var languageChoice = request.query.lang;

  // call to scraper function
  const results =
    (await googleResultObject.buildGoogleResultObject(
      searchQuery,
      languageChoice,
    )) || "Search Failed"; 
  
  response.send(results);
});

app.get("/googlefromlink", async function (request, response) {
  var linkQuery = request.query.link;

  // call to scraper function
  const results =
    (await googleResultObject.fetchCodeFromLink(
      linkQuery
    )) || "Search Failed"; 
  
  response.send(results);
});

// bing scraper route
app.get("/bingresult", async function (request, response) {
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

app.get("/binglinks", async function (request, response) {
  var searchQuery = request.query.sq;
  var languageChoice = request.query.lang;

  // call to scraper function
  const results =
    (await bingResultObject.buildBingResultObject(
      searchQuery,
      languageChoice,
    )) || "Search Failed"; 
  
  response.send(results);
});

app.get("/bingfromlink", async function (request, response) {
  var linkQuery = request.query.link;

  // call to scraper function
  const results =
    (await bingResultObject.fetchCodeFromLink(
      linkQuery
    )) || "Search Failed"; 
  
  response.send(results);
});

// yahoo scraper route
app.get("/yahooresult", async function (request, response) {
  var searchQuery = request.query.sq;
  var languageChoice = request.query.lang;
  var stateChoice = request.query.ls;

  // call to scraper function
  const results =
    (await yahooResultObject.getResultDataLinks(
      searchQuery,
      languageChoice,
      stateChoice
    )) || "Search Failed"; 
  
  // code object from corresponding linkstate website from yahoo search result object to json
  response.send(results);
});

app.get("/yahoolinks", async function (request, response) {
  var searchQuery = request.query.sq;
  var languageChoice = request.query.lang;

  // call to scraper function
  const results =
    (await yahooResultObject.buildYahooResultObject(
      searchQuery,
      languageChoice,
    )) || "Search Failed"; 
  
  response.send(results);
});

app.get("/yahoofromlink", async function (request, response) {
  var linkQuery = request.query.link;

  // call to scraper function
  const results =
    (await yahooResultObject.fetchCodeFromLink(
      linkQuery
    )) || "Search Failed"; 
  
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