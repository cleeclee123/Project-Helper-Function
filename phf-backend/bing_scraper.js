const cheerio = require("cheerio");
const axios = require("axios");

// write request header interface for bing
const OPTIONS = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
  },
};

// function to get bing search results from axios
async function fetchBingSearchData(searchQuery) {
  // encode search query to represent UTF-8, URLs can only have certain characters from ASCII set
  const encodedSearch = encodeURI(searchQuery);

  // default language english
  const languageSearch = "&setlang=en";

  // default united states
  const countrySearch = "&setmkt=en-WW";

  // default 3 results
  // add "see another solution feature"
  /* 
  edge case where bing's top choices have different html classes, 15 is an arbitrary number to 
  ensure that enough b_algo classes are generated
  */
  const numberOfResults = "&count=15";

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
  returnString = returnString.replace("+", "plus");
  return returnString;
}

// scraps the top title and links for search query with programming language as a parameter
// return array of result objects from bing search data
async function buildBingResultObject(searchQuery, pLanguage) {
  // default paraemter values:
  // default search query (result on landing page)
  const defaultSearch = "hello world";
  if (
    searchQuery === "" ||
    searchQuery === null ||
    // demorgans law negation of (typeof myVar === 'string' || myVar instanceof String) => string
    (!(typeof searchQuery === "string") && !(searchQuery instanceof String))
  ) {
    searchQuery = defaultSearch;
  }

  // user choice of programming language, account for empty/null choice
  // most likely will be a dropdown menu on client side
  const defaultLanguage = "javascript";
  if (
    pLanguage === "" ||
    pLanguage === null ||
    // demorgans law negation of (typeof myVar === 'string' || myVar instanceof String) => string
    (!(typeof pLanguage === "string") && !(pLanguage instanceof String))
  ) {
    pLanguage = defaultLanguage;
  }

  // encode search query to represent UTF-8, URLs can only have certain characters from ASCII set
  const encodedPLanguage = encodeURI(helperConvertToWord(pLanguage));

  // calls fetchBingSearchData from axios (promise)
  const searchData = fetchBingSearchData(searchQuery + " " + encodedPLanguage);

  return searchData.then(async function (data) {
    let adata = await data;

    // load markup with cheerio
    let $ = cheerio.load(adata);

    // building result object
    // array : store data points
    const links = [];
    const titles = [];

    // loop through html class ".b_algo" to embedded h2 tag to a tag then getting hyperlink
    $(".b_algo > h2 > a").each((index, element) => {
      links[index] = $(element).attr("href");
    });

    // loop through html class ".b_algo" to embedded h2 tag to a tag then getting text
    $(".b_algo > h2 > a").each((index, element) => {
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

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// function to get data from the first link in the bing result object from axios
async function fetchFirstBingResultPage(searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from bing
  const resultsBing = buildBingResultObject(searchQuery, pLanguage);

  await sleep(1000);
  // data is array of bing result objects
  // makes call to axios to get data from the first link of bing result object
  return await resultsBing.then(async function (data) {
    await sleep(1000);
    console.log(data[0].link);
    // link data from array of bing result object with axios
    const linkData = await axios.get(data[0].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return linkDataPromise;
  });
}

// function to get data from the second link in the bing result object from axios
async function fetchSecondBingResultPage(searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from bing
  const resultsBing = buildBingResultObject(searchQuery, pLanguage);

  await sleep(1000);
  // data is array of bing result objects
  // makes call to axios to get data from the second link of bing result object
  return await resultsBing.then(async function (data) {
    await sleep(1000);
    console.log(data[1].link);
    // link data from array of result object with axios
    const linkData = await axios.get(data[1].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return linkDataPromise;
  });
}

// function to get data from the third link in the bing result object from axios
async function fetchThirdBingResultPage(searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from bing
  const resultsBing = buildBingResultObject(searchQuery, pLanguage);

  await sleep(1000);
  // data is array of bing result objects
  // makes call to axios to get data from the third link of bing result object
  return await resultsBing.then(async function (data) {
    await sleep(1000);
    console.log(data[2].link);
    // link data from array of bing result object with axios
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
// default will be the code object from google search result object
async function getResultDataLinks(searchQuery, pLanguage, linkState) {
  // captcha page message from response.data
  const CAPTCHA_MESSAGE =
    "Our systems have detected unusual traffic from your computer network";

  // linkState will scrap the corresponding website and checks captcha state
  // return "code" object that represents the original searchQuery and corresponding programming language
  if (linkState === 1) {
    const bingPageOne = fetchFirstBingResultPage(searchQuery, pLanguage);

    return bingPageOne.then(async function (data) {
      let adata = await data;

      // load markup with cheerio
      let $ = cheerio.load(adata);

      // build "code" object
      let code = [];
      $("code").each((index, element) => {
        code[index] = $(element).text();
      });

      return code;
    }).catch(async function(error) {
      if (error.response.includes(CAPTCHA_MESSAGE)) {
        throw new Error("Captcha Error")
      }
      throw new Error("Link State 1 Error")
    });
  } else if (linkState === 2) {
    const bingPageTwo = fetchSecondBingResultPage(searchQuery, pLanguage);

    return bingPageTwo.then(async function (data) {
      let adata = await data;

      // load markup with cheerio
      let $ = cheerio.load(adata);

      // build "code" object
      let code = [];
      $("code").each((index, element) => {
        code[index] = $(element).text();
      });

      return code;
    }).catch(async function(error) {
      if (error.response.includes(CAPTCHA_MESSAGE)) {
        throw new Error("Captcha Error")
      }
      throw new Error("Link State 1 Error")
    });
  } else if (linkState === 3) {
    const bingPageThree = fetchThirdBingResultPage(searchQuery, pLanguage);

    return bingPageThree.then(async function (data) {
      let adata = await data;

      // load markup with cheerio
      let $ = cheerio.load(adata);

      // build "code" object
      let code = [];
      $("code").each((index, element) => {
        code[index] = $(element).text();
      });

      return code;
    }).catch(async function(error) {
      if (error.response.includes(CAPTCHA_MESSAGE)) {
        throw new Error("Captcha Error")
      }
      throw new Error("Link State 1 Error")
    });
  } else {
    throw new Error("Link State Error");
  }
}

/* FUNCTIONS TO IMPLEMENT */

// data cleaning function, comes out very messy in some cases

// http server proxy (in server file)

// testing
const code = getResultDataLinks("reverse a linked list", "c++", 1);
code.then(async function (data) {
  await sleep(1000);
  console.log(data);
});
