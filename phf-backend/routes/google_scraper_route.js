const express = require("express");
const router = express.Router();
const googleResultObject = require("../scrapers/google_scraper");

// get route for google search result object
router.post("/googlesearch", async function(request, response) {
  var searchQuery = request.query.searchquery;
  var languageChoice = request.query.searchquery;
  var stateChoice = request.params.linkstate;

  // call to scraper function
  const results =
    (await googleResultObject(
      searchQuery,
      languageChoice,
      stateChoice,
    )) || "Search Failed";

  // code object from corresponding linkstate website from google search result object to json
  results.then(async function (data) {
    response.send(data);
  });
});

module.exports = router;