const cheerio = require("cheerio");
const axios = require("axios");
const promise = require("promise");
const Captcha = require("2captcha");

// write request header interface
const OPTIONS = {
  headers: {
    // "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", 
    // "Accept-Encoding": "gzip, deflate, br", 
    // "Accept-Language": "en-US,en;q=0.9", 
    // "Referer": "https://www.google.com", 
    // "Sec-Ch-Ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"", 
    // "Sec-Ch-Ua-Mobile": "?0", 
    // "Sec-Ch-Ua-Platform": "\"Windows\"", 
    // "Sec-Fetch-Dest": "document", 
    // "Sec-Fetch-Mode": "navigate", 
    // "Sec-Fetch-Site": "cross-site", 
    // "Sec-Fetch-User": "?1", 
    // "Upgrade-Insecure-Requests": "1", 
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36", 
    // "X-Amzn-Trace-Id": "Root=1-629e4d2d-69ff09fd3184deac1df68d18"
  },
};

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
  const numberOfResults = "&num=5";

  // google search data with axios
  const googleSearchData = await axios.get(
    `https://www.google.com/search?q=${encodedSearch} + ${languageSearch} + ${countrySearch} + ${numberOfResults} `,
    OPTIONS
  );

  // new google search data promise
  const newGoogleSearchDataPromise = await googleSearchData.data;
  
  return newGoogleSearchDataPromise;
}

// function to get bing search results from axios
async function fetchBingSearchData(searchQuery) {
  // encode search query to represent UTF-8, URLs can only have certain characters from ASCII set
  const encodedSearch = encodeURI(searchQuery);

  // default english
  const languageSearch = "&setlang=en";

  // default united states
  const countrySearch = "&setmkt=en-WW";

  // default 3,4 results
  // add "see another solution feature"
  const numberOfResults = "&count=5";

  // bing search data with axios
  const bingSearchData = await axios.get(
    `https://www.bing.com/search?q=${encodedSearch} + ${languageSearch} + ${countrySearch} + ${numberOfResults} `,
    OPTIONS
  );

  // new bing search data promise
  const newBingSearchDataPromise = await bingSearchData.data;
  
  return newBingSearchDataPromise;
}

// function helper for the search function to interpret the "++" in "c++"
function helperConvertToWord(input) {
  var returnString = input.toLowerCase();
  returnString = returnString.replace("+", " plus");
  return returnString;
}

// scraps the top title and links for search query with programming language as a parameter
// return array of result objects from google search data
async function getGoogleSearchLinksLang(searchQuery, pLanguage) {
  // default paraemter values:
  // default search query (result on landing page)
  const defaultSearch = "hello world";
  if (searchQuery === "" || 
  searchQuery === null || 
    // demorgans law negation of (typeof myVar === 'string' || myVar instanceof String) => string
    (!(typeof searchQuery === "string") && 
    !(searchQuery instanceof String))) {
    searchQuery = defaultSearch;
  }

  // user choice of programming language, account for empty/null choice
  // most likely will be a dropdown menu on client side
  const defaultLanguage = "javascript";
  if (pLanguage === "" || 
      pLanguage === null || 
      // demorgans law negation of (typeof myVar === 'string' || myVar instanceof String) => string
      (!(typeof pLanguage === "string") && 
      !(pLanguage instanceof String))) {
    pLanguage = defaultLanguage;
  }

  // encode search query to represent UTF-8, URLs can only have certain characters from ASCII set
  const encodedPLanguage = encodeURI(helperConvertToWord(pLanguage));

  // calls fetchGoogleSearchData from axios (promise)
  const searchData = fetchGoogleSearchData(searchQuery + " " + encodedPLanguage); 

  return searchData.then(async function(data) {
    // load markup with cheerio
    let $ = cheerio.load(data, {xmlMode: true});
    console.log($);

    // building result object
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

// scraps the top title and links for search query with programming language as a parameter
// return array of result objects from bing search data
async function getBingSearchLinksLang(searchQuery, pLanguage) {
  // default paraemter values:
  // default search query (result on landing page)
  const defaultSearch = "hello world";
  if (searchQuery === "" || 
  searchQuery === null || 
    // demorgans law negation of (typeof myVar === 'string' || myVar instanceof String) => string
    (!(typeof searchQuery === "string") && 
    !(searchQuery instanceof String))) {
    searchQuery = defaultSearch;
  }

  // user choice of programming language, account for empty/null choice
  // most likely will be a dropdown menu on client side
  const defaultLanguage = "javascript";
  if (pLanguage === "" || 
      pLanguage === null || 
      // demorgans law negation of (typeof myVar === 'string' || myVar instanceof String) => string
      (!(typeof pLanguage === "string") && 
      !(pLanguage instanceof String))) {
    pLanguage = defaultLanguage;
  }

  // encode search query to represent UTF-8, URLs can only have certain characters from ASCII set
  const encodedPLanguage = encodeURI(helperConvertToWord(pLanguage));

  // calls fetchBingSearchData from axios (promise)
  const searchData = fetchBingSearchData(searchQuery + " " + encodedPLanguage); 

  return searchData.then(async function(data) {
    // load markup with cheerio
    let $ = cheerio.load(data);

    // building result object
    // array : store data points
    const links = [];
    const titles = [];

    // loop through html class ".b_algo" to embedded h2 tag to a tag then getting hyperlink
    $("li.b_algo > h2 > a").each((index, element) => {
      links[index] = $(element).attr("href");
    });

    // loop through html class ".b_algo" to embedded h2 tag to a tag then getting text
    $("li.b_algo > h2 > a").each((index, element) => {
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

    
    // link data from array of result object with axios
    const linkData = await axios.get(data[0].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return linkDataPromise;
  });
}

// function to data from the second link in the result object from axios
async function fetchSecondResultData(searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from google
  const results = getGoogleSearchLinksLang(searchQuery, pLanguage);

  // data is array of result objects
  // makes call to axios to get data from the first link
  return results.then(async function(data) {

    // link data from array of result object with axios
    const linkData = await axios.get(data[1].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return linkDataPromise;
  });
}

// function to data from the third link in the result object from axios
async function fetchThirdResultData(searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from google
  const results = getGoogleSearchLinksLang(searchQuery, pLanguage);

  // data is array of result objects
  // makes call to axios to get data from the first link
  return results.then(async function(data) {

    // link data from array of result object with axios
    const linkData = await axios.get(data[2].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return linkDataPromise;
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
    return resultDataLinkOne.then(async function(data) {
      // load markup with cheerio
      let $ = cheerio.load(data);

      // build "code" object
      let code = [];
      $("code:first > span").each((index, element) => {
        code[index] = $(element);
      });
      return code;
    });
  } /* else if (linkState == 2) {
    return resultDataLinkTwo.then(async function(data) {
      // load markup with cheerio
      let $ = cheerio.load(data);

      // build "code" object
      let code = [];
      $("code:first").each((index, element) => {
        code[index] = $(element).attr("span");
      });

    });
  } else if (linkState == 3) {
    return resultDataLinkThree.then(async function(data) {
      // load markup with cheerio
      let $ = cheerio.load(data);

      // build "code" object
      let code = [];
      $("code:first").each((index, element) => {
        code[index] = $(element).attr("span");
      });

    });
  } */ else {
    throw "linkState Error"
  }
}

// testing 
const result = getBingSearchLinksLang("is a palindrome", "c plus plus");
// const result = getResultDataLinks("is a palindrome", "c++", 1);
result.then(function(data) {
  data.forEach((i) => {
    console.log(i);
  })
});