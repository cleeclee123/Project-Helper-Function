const cheerio = require("cheerio");
const axios = require("axios");

const ERROR_MESSAGE_R = "Sorry, an error as occured. Please try again";

// scraps sslproxies.org for port numbers and ip addresses
const generateProxy = async function () {
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
};

// function to rotate user agents (hard coded/mannual tested)
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

// util function to get user agent and proxy specifically
async function optionsUtils() {
  return generateProxy().then(async function (proxy) {
    return { userAgent: rotateUserAgent(), proxy: proxy };
  });
}

// write request header interface for google
const OPTIONS = async function () {
  return optionsUtils().then(async function (data) {
    let platformUA = "";
    if (String(data.userAgent).includes("(Windows")) {
      platformUA = "Windows";
    } else if (String(data.userAgent).includes("(Macintosh")) {
      platformUA = "macOS";
    } else {
      platformUA = "Chrome OS";
    }
    return (headersOptions = {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        Referer: "https://www.google.com",
        Connection: "keep-alive",
        DNT: "1",
        Proxy: data.proxy,
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "max-age=0",
        "Sec-Ch-Ua":
          '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": platformUA,
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": data.userAgent,
        "X-Amzn-Trace-Id": "Root=1-629e4d2d-69ff09fd3184deac1df68d18",
      },
    });
  });
};

// function to get google search results from axios
const fetchGoogleSearchData = async function (searchQuery) {
  // encode search query to represent UTF-8, URLs can only have certain characters from ASCII set
  const encodedSearch = encodeURI(searchQuery);

  // default english
  const languageSearch = "&hl=en";

  // default united states
  const countrySearch = "&gl=us";

  // number of search results found
  const numberOfResults = "&num=6";

  // wrap inside OPTIONS function callback to return request headers
  return OPTIONS().then(async function (data) {
    // bing search data with axios
    const googleSearchData = await axios.get(
      `https://www.google.com/search?q=${encodedSearch}${languageSearch}${countrySearch}${numberOfResults}`,
      data
    );
    // new google search data promise
    const newGoogleSearchDataPromise = await googleSearchData.data;

    return { promise: newGoogleSearchDataPromise, requestHeader: data };
  });
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
    // load markup with cheerio
    let $ = cheerio.load(data.promise);

    // building result object
    // array : store data points
    const links = [];
    const titles = [];
    const captions = [];

    // loop through html class ".yuRUbf" to hyperlink tag
    $(".yuRUbf > a").each((index, element) => {
      links[index] = $(element).attr("href");
    });

    // loop through html class ".yuRUbf" to hyperlink tag to header tag
    $(".yuRUbf > a > h3").each((index, element) => {
      titles[index] = $(element).text();
    });

    // loop through html class ".yuRUbf" to hyperlink tag to header tag
    $("div.NJo7tc.Z26q7c.UK95Uc.uUuwM > div > span").each((index, element) => {
      captions[index] = $(element).text();
    });

    // fill array with result object
    const results = [];
    for (let i = 0; i < links.length; i++) {
      results[i] = {
        link: links[i],
        title: titles[i],
        caption: captions[i],
        dateScraped: new Date().toLocaleString(),
      };
    }
    return { results: results, requestHeader: data.requestHeader };
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

    // console.log("google linkstate 1", data.results[0].link);

    // link data from array of google result object with axios
    const linkData = await axios.get(data.results[0].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return {
      source: data.results[0].link,
      title: data.results[0].title,
      linkPromise: linkDataPromise,
      requestHeader: data.requestHeader,
    };
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

    //console.log("google linkstate 2", data.results[1].link);

    // link data from array of result object with axios
    const linkData = await axios.get(data.results[1].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return {
      source: data.results[1].link,
      title: data.results[1].title,
      linkPromise: linkDataPromise,
      requestHeader: data.requestHeader,
    };
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

    // console.log("google linkstate 3", data.results[2].link);

    // link data from array of google result object with axios
    const linkData = await axios.get(data.results[2].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return {
      source: data.results[2].link,
      title: data.results[2].title,
      linkPromise: linkDataPromise,
      requestHeader: data.requestHeader,
    };
  });
};

// function to get data from the fourth link in the google result object from axios
const fetchFourthGoogleResultPage = async function (searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from google
  const resultsGoogle = buildGoogleResultObject(searchQuery, pLanguage);

  await sleep(1000);
  // data is array of bing result objects
  // makes call to axios to get data from the third link of google result object
  return await resultsGoogle.then(async function (data) {
    await sleep(1000);

    //console.log("google linkstate 4", data.results[3].link);

    // link data from array of google result object with axios
    const linkData = await axios.get(data.results[3].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return {
      source: data.results[3].link,
      title: data.results[3].title,
      linkPromise: linkDataPromise,
      requestHeader: data.requestHeader,
    };
  });
};

// function to get data from the fifth link in the google result object from axios
const fetchFifthGoogleResultPage = async function (searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from google
  const resultsGoogle = buildGoogleResultObject(searchQuery, pLanguage);

  await sleep(1000);
  // data is array of bing result objects
  // makes call to axios to get data from the third link of google result object
  return await resultsGoogle.then(async function (data) {
    await sleep(1000);

    //console.log("google linkstate 5", data.results[4].link);

    // link data from array of google result object with axios
    const linkData = await axios.get(data.results[4].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return {
      source: data.results[4].link,
      title: data.results[4].title,
      linkPromise: linkDataPromise,
      requestHeader: data.requestHeader,
    };
  });
};

// returns "code" object
// function to start scraping data from result object links, takes in searchQuery, pLanguage, and state of result link
// linkState is an int that repersents which link in the result array (1, 2, 3, 4, 5)
// linkState will be a dropdown menu/next button on the frontend
// default will be the code object from google search result object
const getResultDataLinks = async function (searchQuery, pLanguage, linkState) {
  // captcha page message from response.data
  const CAPTCHA_MESSAGE =
    "Our systems have detected unusual traffic from your computer network";
  const CAPTCHA_ERROR = "Captached";
  const LINK_STATE_ERROR = "Link State Error";
  const ERROR_MESSAGE = "An Error has ocurred, please try again";
  const BAD_SCRAP =
    "// We didn't have anything to scrape, please try again using a different engine";

  // linkState will scrap the corresponding website and checks captcha state
  // return "code" object that represents the original searchQuery and corresponding programming language
  if (linkState === "1") {
    const googlePageOne = fetchFirstGoogleResultPage(searchQuery, pLanguage);
    return googlePageOne
      .then(async function (data) {
        // load markup with cheerio
        let $ = cheerio.load(data.linkPromise);

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

        return {
          source: data.source,
          title: data.title,
          linkState: linkState,
          code: code,
          requestHeader: data.requestHeader,
        };
      })
      .catch(async function (error) {
        if (String(error.response).includes(CAPTCHA_MESSAGE)) {
          return CAPTCHA_ERROR;
        }
        return `${LINK_STATE_ERROR} at ls:${linkState}`;
      });
  } else if (linkState === "2") {
    const googlePageTwo = fetchSecondGoogleResultPage(searchQuery, pLanguage);

    return googlePageTwo
      .then(async function (data) {
        // load markup with cheerio
        let $ = cheerio.load(data.linkPromise);

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

        return {
          source: data.source,
          title: data.title,
          linkState: linkState,
          code: code,
          requestHeader: data.requestHeader,
        };
      })
      .catch(async function (error) {
        if (String(error.response).includes(CAPTCHA_MESSAGE)) {
          return CAPTCHA_ERROR;
        }
        return `${LINK_STATE_ERROR} at ls:${linkState}`;
      });
  } else if (linkState === "3") {
    const googlePageThree = fetchThirdGoogleResultPage(searchQuery, pLanguage);

    return googlePageThree
      .then(async function (data) {
        // load markup with cheerio
        let $ = cheerio.load(data.linkPromise);

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

        return {
          source: data.source,
          title: data.title,
          linkState: linkState,
          code: code,
          requestHeader: data.requestHeader,
        };
      })
      .catch(async function (error) {
        if (String(error.response).includes(CAPTCHA_MESSAGE)) {
          return CAPTCHA_ERROR;
        }
        return `${LINK_STATE_ERROR} at ls:${linkState}`;
      });
  } else if (linkState === "4") {
    const googlePageFour = fetchFourthGoogleResultPage(searchQuery, pLanguage);

    return googlePageFour
      .then(async function (data) {
        // load markup with cheerio
        let $ = cheerio.load(data.linkPromise);

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

        return {
          source: data.source,
          title: data.title,
          linkState: linkState,
          code: code,
          requestHeader: data.requestHeader,
        };
      })
      .catch(async function (error) {
        if (String(error.response).includes(CAPTCHA_MESSAGE)) {
          return CAPTCHA_ERROR;
        }
        return `${LINK_STATE_ERROR} at ls:${linkState}`;
      });
  } else if (linkState === "5") {
    const googlePageFive = fetchFifthGoogleResultPage(searchQuery, pLanguage);

    return googlePageFive
      .then(async function (data) {
        // load markup with cheerio
        let $ = cheerio.load(data.linkPromise);

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

        return {
          source: data.source,
          title: data.title,
          linkState: linkState,
          code: code,
          requestHeader: data.requestHeader,
        };
      })
      .catch(async function (error) {
        if (String(error.response).includes(CAPTCHA_MESSAGE)) {
          return CAPTCHA_ERROR;
        }
        return `${LINK_STATE_ERROR} at ls:${linkState}`;
      });
  } else {
    return ERROR_MESSAGE;
  }
};

module.exports = {
  getResultDataLinks,
  buildGoogleResultObject,
};