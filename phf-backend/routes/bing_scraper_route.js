const express = require("express");
const router = express.Router();
const bingResultObject = require("./scrapers/bing_scraper");

// get route for bing search result object
router.post("/bingsearch/:searchquery/:planguage/:linkstate", async function(request, response) {
    var searchQuery = request.params.searchquery;
    var languageChoice = request.params.planguage;
    var stateChoice = request.params.linkstate;
  
    // call to scraper function
    const bingResultObjectCode =
      (await bingResultObject(
        searchQuery,
        languageChoice,
        stateChoice,
      )) || "Search Failed";
   
    // code object from corresponding linkstate website from bing search result object to json
    bingResultObjectCode.then(async function (data) {
      const toJson = JSON.stringify(data);
      response.send(toJson);
    });
  });

module.exports = router;
