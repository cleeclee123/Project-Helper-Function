const express = require("express");
const router = express.Router();
const bingResultObject = require("./scrapers/bing_scraper");

// get route for bing search result object
router.post("/bingsearch", async function (request, response) {
  var searchQuery = request.query.searchquery;
  var languageChoice = request.query.searchquery;
  var stateChoice = request.params.linkstate;

  const results = ((await bingResultObject.getResultDataLinks(
    searchQuery,
    languageChoice,
    stateChoice
  )) || "Search Failed");

  results.then(async function (data) {
    response.send(data);
  });
});

module.exports = router;