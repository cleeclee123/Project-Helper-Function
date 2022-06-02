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
// return array of result objects from google search data
async function getGoogleSearchLinksLang(searchQuery, pLanguage) {
  // "c++" is not recognized, search query to "plus plus"
  if (pLanguage === "c++") {
    pLanguage === "c plus plus";
  }
  
  // user choice of programming language, account for empty/null choice
  // most likely will be a dropdown menu on client side
  const defaultLanguage = "javascript";
  if (pLanguage === "" || pLanguage === null) {
    pLanguage = defaultLanguage;
  }

  // encode search query to represent UTF-8, URLs can only have certain characters from ASCII set
  const encodedPLanguage = encodeURI(pLanguage);

  // calls fetchGoogleSearchData from axios (promise)
  const searchData = fetchGoogleSearchData(searchQuery + " " + encodedPLanguage); 

  return searchData.then(async function(data) {
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
    return results;
  });
}

// function to data from the first link in the result object from axios
async function fetchFirstResultData(searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from google
  const results = getGoogleSearchLinksLang(searchQuery, pLanguage);

  // data is array of result objects
  // makes call to axios to get data from the first link
  return results.then(async function(data) {

    // write header interface
    const options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
      },
    };

    // first link data from array of result object with axios
    const firstLinkData = await axios.get(data[0].link, options);

    // new first link data promise
    const firstLinkDataPromise = await firstLinkData.data;

    return firstLinkDataPromise;
  });
}

// function to data from the second link in the result object from axios
async function fetchSecondResultData(searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from google
  const results = getGoogleSearchLinksLang(searchQuery, pLanguage);

  // data is array of result objects
  // makes call to axios to get data from the first link
  return results.then(async function(data) {

    // write header interface
    const options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
      },
    };

    // first link data from array of result object with axios
    const firstLinkData = await axios.get(data[1].link, options);

    // new first link data promise
    const firstLinkDataPromise = await firstLinkData.data;

    return firstLinkDataPromise;
  });
}

// function to data from the third link in the result object from axios
async function fetchThirdResultData(searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from google
  const results = getGoogleSearchLinksLang(searchQuery, pLanguage);

  // data is array of result objects
  // makes call to axios to get data from the first link
  return results.then(async function(data) {

    // write header interface
    const options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
      },
    };

    // first link data from array of result object with axios
    const firstLinkData = await axios.get(data[2].link, options);

    // new first link data promise
    const firstLinkDataPromise = await firstLinkData.data;

    return firstLinkDataPromise;
  });
}

// returns "code" object
// function to start scraping data from result object links, takes in searchQuery, pLanguage, and state of result link
// linkState is an int that repersents which link in the result array (1, 2, 3)
// linkState will be a dropdown menu/next button on the frontend
async function getResultDataLinks(searchQuery, pLanguage, linkState) {
  // page data from link one in reuslt object array
  const resultDataLinkOne = fetchFirstResultData(searchQuery, pLanguage);

  // page data from link two in reuslt object array
  const resultDataLinkTwo = fetchSecondResultData(searchQuery, pLanguage);
  
  // page data from link three in reuslt object array
  const resultDataLinkThree = fetchThirdResultData(searchQuery, pLanguage);
  
  // linkState will scrap the corresponding website
  // return "code" object that represents the original searchQuery and corresponding programming language
  if (linkState == 1) {

  } else if (linkState == 2) {

  } else if (linkState == 3) {

  } else {
    throw "linkState Error";
  }
}


// testing 
const result = ""; 
result = fetchThirdResultData("is a palindrome", "c plus plus");
// const result = getGoogleSearchLinksLang("is a palindrome", "c plus plus");
result.then(function(data) {
  console.log(data);
});

