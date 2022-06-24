const express = require("express");
const router = express.Router();
const bingResultObject = require("./scrapers/bing_scraper");

// get route for bing search result object
router.post("/bingsearch", async function(request, response) {
  const results = bingResultObject.getResultDataLinks(request.query.searchquery, request.query.searchquery, request.params.linkstate);
  response.send(results);
});

module.exports = router;
