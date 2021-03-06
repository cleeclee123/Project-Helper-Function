const cheerio = require("cheerio");
const axios = require("axios");

const ERROR_MESSAGE_R = "Sorry, an error as occured. Please try again";

/* disregard this */
// state must either be 0 === ip_address or 1 === port_numbers
// returns the corresponding array (for axios header proxy options)
/* disregard this */

// scraps sslproxies.org for port numbers and ip addresses
const generateProxy = async function (/* state */) {
  /* if (state !== 0 || state !== 1) {
    throw new Error("Generate Proxy State Error");
  } */

  let ip_addresses = [];
  let port_numbers = [];

  await axios
    .get("https://sslproxies.org/")
    .then(async function (response) {
      // load html data with cheerio
      const $ = cheerio.load(response.data);

      // loop through table tag, first class name nth-child
      $("td:nth-child(1)").each((index, element) => {
        ip_addresses[index] = $(element).text();
      });

      // loop through table tag, second class name nth-child
      $("td:nth-child(2)").each((index, element) => {
        port_numbers[index] = $(element).text();
      });

      ip_addresses.join(", ");
      port_numbers.join(", ");
    })
    .catch(async function (error) {
      // console.log(error.response);
      // throw new Error("Proxy Rotation Scrap Error");
      return `${ERROR_MESSAGE_R} ${error}`;
    });

  let random_number = Math.floor(Math.random() * 100);
  let proxy = `http://${ip_addresses[random_number]}:${port_numbers[random_number]}`;

  return proxy;

  /* if (state === 0) {
    return ip_addresses[random_number];
  } else if (state === 1) {
    return port_numbers[random_number];
  } else {
    // should never get here
    throw new Error("Generate Proxy State Error");
  } */
};

// function to rotate user agents by scrapping github repo
const rotateUserAgent = function () {
  let userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; CrOS x86_64 10066.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:70.0) Gecko/20100101 Firefox/70.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:70.0) Gecko/20100101 Firefox/70.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36 Edg/102.0.100.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/604.1 Edg/102.0.100.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 OPR/65.0.3467.48",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 OPR/65.0.3467.48",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Safari/605.1.15",
  ];
  let randomNumber = Math.floor(Math.random() * userAgents.length - 1);
  let rotatedUserAgent = userAgents[randomNumber];
  return String(rotatedUserAgent);
};

// write request header interface for google
const OPTIONS = {
  headers: {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    //"Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.google.com",
    "Sec-Ch-Ua":
      '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": rotateUserAgent(),
    "X-Amzn-Trace-Id": "Root=1-629e4d2d-69ff09fd3184deac1df68d18",
    Proxy: generateProxy(),
  },
};

// function to get google search results from axios
const fetchGoogleSearchData = async function (searchQuery) {
  // encode search query to represent UTF-8, URLs can only have certain characters from ASCII set
  const encodedSearch = encodeURI(searchQuery);

  // default english
  const languageSearch = "&hl=en";

  // default united states
  const countrySearch = "&gl=us";

  // default 3,4 results
  // add "see another solution feature"
  const numberOfResults = "&num=4";

  // google search data with axios
  const googleSearchData = await axios.get(
    `https://www.google.com/search?q=${encodedSearch} + ${languageSearch} + ${countrySearch} + ${numberOfResults} `,
    OPTIONS
  );

  // new google search data promise
  const newGoogleSearchDataPromise = await googleSearchData.data;

  return newGoogleSearchDataPromise;
};

// function helper for the search function to interpret the "++" in "c++"
const helperConvertToWord = function (input) {
  var returnString = input.toLowerCase();
  returnString = returnString.replace("+", "p");
  returnString = returnString.replace("#", "sharp");
  return returnString;
};

// scraps the top title and links for search query with programming language as a parameter
// return array of result objects from google search data
const buildGoogleResultObject = async function (searchQuery, pLanguage) {
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

  // calls fetchGoogleSearchData from axios (promise)
  const searchData = fetchGoogleSearchData(
    searchQuery + " " + encodedPLanguage
  );

  return searchData.then(async function (data) {
    let adata = await data;

    // load markup with cheerio
    let $ = cheerio.load(adata);

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
};

const sleep = function (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
};

// function to get data from the first link in the google result object from axios
const fetchFirstGoogleResultPage = async function (searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from bing
  const resultsGoogle = buildGoogleResultObject(searchQuery, pLanguage);

  await sleep(1000);
  // data is array of google result objects
  // makes call to axios to get data from the first link of google result object
  return await resultsGoogle.then(async function (data) {
    await sleep(1000);
    console.log("google linkstate 1", data[0].link);
    // link data from array of google result object with axios
    const linkData = await axios.get(data[0].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return linkDataPromise;
  });
};

// function to get data from the second link in the google result object from axios
const fetchSecondGoogleResultPage = async function (searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from google
  const resultsGoogle = buildGoogleResultObject(searchQuery, pLanguage);

  await sleep(1000);
  // data is array of google result objects
  // makes call to axios to get data from the second link of google result object
  return await resultsGoogle.then(async function (data) {
    await sleep(1000);
    console.log("google linkstate 2", data[1].link);
    // link data from array of result object with axios
    const linkData = await axios.get(data[1].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return linkDataPromise;
  });
};

// function to get data from the third link in the google result object from axios
const fetchThirdGoogleResultPage = async function (searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from google
  const resultsGoogle = buildGoogleResultObject(searchQuery, pLanguage);

  await sleep(1000);
  // data is array of bing result objects
  // makes call to axios to get data from the third link of google result object
  return await resultsGoogle.then(async function (data) {
    await sleep(1000);
    console.log("google linkstate 3", data[2].link);
    // link data from array of google result object with axios
    const linkData = await axios.get(data[2].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return linkDataPromise;
  });
};

// returns "code" object
// function to start scraping data from result object links, takes in searchQuery, pLanguage, and state of result link
// linkState is an int that repersents which link in the result array (1, 2, 3)
// linkState will be a dropdown menu/next button on the frontend
// default will be the code object from google search result object
const getResultDataLinks = async function (searchQuery, pLanguage, linkState) {
  // captcha page message from response.data
  const CAPTCHA_MESSAGE =
    "Our systems have detected unusual traffic from your computer network";

  const ERROR_MESSAGE = 
    "// An Error has occured, please try again";

  const BAD_SCRAP = 
    "// We didn't have anything to scrape, please try again using a different engine";

  // linkState will scrap the corresponding website and checks captcha state
  // return "code" object that represents the original searchQuery and corresponding programming language
  if (linkState === "1") {
    const googlePageOne = fetchFirstGoogleResultPage(searchQuery, pLanguage);

    return googlePageOne
      .then(async function (data) {
        let adata = await data;

        // load markup with cheerio
        let $ = cheerio.load(adata);

        // build "code" object
        let code = [];

        // loop through code tag on page
        $("code").each((index, element) => {
          code[index] = $(element).text();
        });

        // if code array is empty, loop through all tags with class "code"
        if (code.length === 0 || code === undefined) {
          $(".code").each((index, element) => {
            code[index] = $(element).text();
          });
        }

        // if code array is empty, loop through pre tag on page
        if (code.length === 0 || code === undefined) {
          $("pre").each((index, element) => {
            code[index] = $(element).text();
          });
        }
        
        // if code is empty
        if (code.length === 0 || code == undefined) {
          return BAD_SCRAP;
        }

        return code;
      })
      .catch(async function (error) {
        /* if (error.response.data.includes(CAPTCHA_MESSAGE)) {
        throw new Error("Captcha Error")
      } */
        console.log(error);
        return ERROR_MESSAGE;
        // throw new Error("Link State 1 Error");
      });
  } else if (linkState === "2") {
    const googlePageTwo = fetchSecondGoogleResultPage(searchQuery, pLanguage);

    return googlePageTwo
      .then(async function (data) {
        let adata = await data;

        // load markup with cheerio
        let $ = cheerio.load(adata);

        // build "code" object
        let code = [];

        // loop through code tag on page
        $("code").each((index, element) => {
          code[index] = $(element).text();
        });

        // if code array is empty, loop through all tags with class "code"
        if (code.length === 0 || code === undefined) {
          $(".code").each((index, element) => {
            code[index] = $(element).text();
          });
        }

        // if code array is empty, loop through pre tag on page
        if (code.length === 0 || code === undefined) {
          $("pre").each((index, element) => {
            code[index] = $(element).text();
          });
        }

        // if code is empty
        if (code.length === 0 || code == undefined) {
          return BAD_SCRAP;
        }

        return code;
      })
      .catch(async function (error) {
        /* if (error.response.data.includes(CAPTCHA_MESSAGE)) {
        throw new Error("Captcha Error");
      } */
        console.log(error);
        return ERROR_MESSAGE;
        //throw new Error("Link State 2 Error");
      });
  } else if (linkState === "3") {
    const googlePageThree = fetchThirdGoogleResultPage(searchQuery, pLanguage);

    return googlePageThree
      .then(async function (data) {
        let adata = await data;

        // load markup with cheerio
        let $ = cheerio.load(adata);

        // build "code" object
        let code = [];

        // loop through code tag on page
        $("code").each((index, element) => {
          code[index] = $(element).text();
        });

        // if code array is empty, loop through all tags with class "code"
        if (code.length === 0 || code === undefined) {
          $(".code").each((index, element) => {
            code[index] = $(element).text();
          });
        }

        // if code array is empty, loop through pre tag on page
        if (code.length === 0 || code === undefined) {
          $("pre").each((index, element) => {
            code[index] = $(element).text();
          });
        }

        // if code array is empty, loop through td tag on page
        if (code.length === 0 || code === undefined) {
          $("td").each((index, element) => {
            code[index] = $(element).text();
          });
        }

        // if code is empty
        if (code.length === 0 || code == undefined) {
          return BAD_SCRAP;
        }

        return code;
      })
      .catch(async function (error) {
        /* if (error.repsonse.data.includes(CAPTCHA_MESSAGE)) {
        throw new Error("Captcha Error")
      } */
        console.log(error);
        return ERROR_MESSAGE;
        //throw new Error("Link State 3 Error");
      });
  } else {
    return ERROR_MESSAGE;
    // throw new Error("Link State Error");
  }
};

module.exports = {
  getResultDataLinks,
  fetchGoogleSearchData,
  buildGoogleResultObject
};

// simple testing
const code = getResultDataLinks("hello world", "typescript", "1");
code.then(async function (data) {
  await sleep(1000);
  console.log(data);
});

/* const test = buildGoogleResultObject("hello world", "c++");
test.then(async function (data) {
  console.log(data);
}); */

/* const proxy = generateProxy();
proxy.then(async function(data) {
  console.log(data);
})
*/
