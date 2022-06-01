const cheerio = require("cheerio");
const axios = require("axios");
const promise = require("promise");


// function to get google search results from axios
async function fetchGoogleSearchData(searchQuery) {
  // encode search query to represent UTF-8, URLs can only have certain characters from ASCII set
  const encodedSearch = encodeURI(searchQuery);

  // default english
  const languageSearch = "&hl=en";

  // default united states
  const countrySearch = "&gl=us";

  // default 3,4 results
  // add "see another solution feature"
  const numberOfResults = "&num=3";

  // write header interface
  const options = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
    },
  };

  // google search data with axios
  const googleSearchData = await axios.get(
    `https://www.google.com/search?q=${encodedSearch} + ${languageSearch} + ${countrySearch} + ${numberOfResults} `,
    options
  );

  // new google search data promise
  const newGoogleSearchDataPromise = await googleSearchData.data;
  
  return newGoogleSearchDataPromise;
}

// scraps the top title and links for search query with programming language as a parameter
// need to return array of results object from google search data
function getGoogleSearchLinksLang(searchQuery, pLanguage) {
  // user choice of programming language, account for empty/null choice
  // most likely will be a dropdown menu on client side
  const defaultLanguage = "javascript";
  if (!!pLanguage) {
    pLanguage = defaultLanguage;
  }

  // calls fetchGoogleSearchData from axios (promise)
  const searchData = fetchGoogleSearchData(searchQuery + " " + pLanguage); 

  // calls .then on promise to capture results
  // start to scrap here 
  searchData.then(function(data) {

    // load markup with cheerio
    let $ = cheerio.load(data);

    // array : store data points
    const links = [];
    const titles = [];

    // loop through html class ".yuRUbf" to hyperlink tag
    $(".yuRUbf > a").each((index, element) => {
      links[index] = $(element).attr("href");
    });

    // loop through html class ".yuRUbf" to hyperlink tag to header tag
    $(".yuRUbf > a > h3").each((index, element) => {
      titles[index] = $(element).text();
    });

    // fill array with result object
    const results = [];
    for (let i = 0; i < links.length; i++) {
      results[i] = {
        link: links[i],
        title: titles[i],
      };
    }
    console.log(results);
    // return results;
  });
}


getGoogleSearchLinksLang("is a palidrome", );