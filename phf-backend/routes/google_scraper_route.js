const express = require("express");
const router = express.Router();
const googleResultObject = require("./scrapers/google_scraper");

// get route for google search result object
router.post("/googlesearch/:searchquery/:planguage/:linkstate", async function(request, response) {
  var searchQuery = request.params.searchquery;
  var languageChoice = request.params.planguage;
  var stateChoice = request.params.linkstate;

  // call to scraper function
  const googleResultObjectCode =
    (await googleResultObject(
      searchQuery,
      languageChoice,
      stateChoice,
    )) || "Search Failed";

  // code object from corresponding linkstate website from google search result object to json
  googleResultObjectCode.then(async function (data) {
    const toJson = JSON.stringify(data);
    response.send(toJson);
  });
});

module.exports = router;
