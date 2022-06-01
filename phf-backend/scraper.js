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
  const numberOfResults = "&num=4";

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

// scraps the top title and links for search query
function getGoogleSearchLinks(searchQuery) {
  // calls fetchGoogleSearchData from axios (promise)
  const searchData = fetchGoogleSearchData(searchQuery); 

  // calls .then on promise to capture results
  // start to scrap here 
  searchData.then(function(data) {
    console.log(data);
  })
}

// scraps the top title and links for search query
/* function getGoogleSearchLinks(searchQuery) {
  const googleSearchData = fetchGoogleSearchData(searchQuery).()
}  */

/* 
// scraps the top title and links for search query
function getGoogleSearchLinks(searchQuery) {
  // encode search query to represent UTF-8, URLs can only have certain characters from ASCII set
  const encodedSearch = encodeURI(searchQuery);

  // default english
  const languageSearch = "&hl=en";

  // default united states
  const countrySearch = "&gl=us";

  // default 3,4 results
  // add "see another solution feature"
  const numberOfResults = "&num=4";

  // write header interface
  const options = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
    },
  };

  axios
    .get(
      `https://www.google.com/search?q=${encodedSearch} + ${languageSearch} + ${countrySearch} + ${numberOfResults} `,
      options
    )
    .then(async function({ data }) {
      let $ = cheerio.load(data);

      const links = [];
      const titles = [];

      $(".yuRUbf > a").each((index, element) => {
        links[index] = $(element).attr("href");
      });

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
    }); 
}

getGoogleSearchLinks("is a palindrome");

 */

getGoogleSearchLinks("test");