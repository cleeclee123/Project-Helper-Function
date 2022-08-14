const cheerio = require("cheerio");
const axios = require("axios");
const HTMLParser = require('node-html-parser');

const ERROR_MESSAGE_R = "Sorry, an error as occured. Please try again";

// scraps sslproxies.org for port numbers and ip addresses
const generateProxy = async function () {
  let ipAddresses = [];
  let portNumbers = [];

  await axios
    .get("https://sslproxies.org/")
    .then(async function (response) {
      // load html data with cheerio
      const $ = cheerio.load(response.data);

      // loop through table tag, grab second nth-child
      $("td:nth-child(1)").each((index, element) => {
        ipAddresses[index] = $(element).text();
      });

      // loop through table tag, grab second nth-child
      $("td:nth-child(2)").each((index, element) => {
        portNumbers[index] = $(element).text();
      });

      ipAddresses.join(", ");
      portNumbers.join(", ");
    })
    .catch(async function (error) {
      return `${ERROR_MESSAGE_R} ${error}`;
    });

  let randomNumber = Math.floor(Math.random() * 100);
  let proxy = `http://${ipAddresses[randomNumber]}:${portNumbers[randomNumber]}`;

  return proxy;
};

// function to rotate user agents by scrapping github repo, returns a string
const rotateUserAgent = async function () {
  let userAgents = [];

  await axios
    .get(
      "https://github.com/tamimibrahim17/List-of-user-agents/blob/master/Chrome.txt"
    )
    .then(async function (repsonse) {
      // load html with cheerio
      const $ = cheerio.load(repsonse.data);

      // loop through tr tag, loop through table tag, grab second nth-child
      // check for space (valid user agent) and will only scrap windows, mac, and x11 (linux) uas
      $("tr > td:nth-child(2)").each((index, element) => {
        if (
          ($(element).text().includes(" ") &&
            $(element).text().includes("(Windows")) ||
          ($(element).text().includes(" ") &&
            $(element).text().includes("(Macintosh")) ||
          ($(element).text().includes(" ") &&
            $(element).text().includes("(X11"))
        ) {
          userAgents[index] = $(element).text();
        }
      });

      userAgents.join(", ");
    })
    .catch(async function (error) {
      return `${ERROR_MESSAGE_R} ${error}`;
    });

  let randomNumber = Math.floor(Math.random() * 100);
  let rotatedUserAgent = userAgents[randomNumber];
  return String(rotatedUserAgent);
};

// util function to get user agent and proxy specifically
async function optionsUtils() {
  return rotateUserAgent().then(async function (ua) {
    return generateProxy().then(async function (proxy) {
      return { userAgent: ua, proxy: proxy };
    });
  });
}

// write request header interface for bing
const OPTIONS = async function () {
  return optionsUtils().then(async function (data) {
    let platformUA = "";
    if (String(data.userAgent).includes("(Windows")) {
      platformUA = "Windows";
    } else if (String(data.userAgent).includes("(Macintosh")) {
      platformUA = "macOS";
    } else if (String(data.userAgent).includes("(X11")) {
      platformUA = "Linux";
    } else {
      platformUA = "Chrome OS";
    }
    return (headersOptions = {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        Referer: "https://www.yahoo.com",
        Connection: "keep-alive",
        DNT: "1",
        Proxy: data.proxy,
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "max-age=0",
        "Sec-Ch-Ua":
          '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
        "Sec-Ch-Ua-Mobile": "?0",
        "sec-ch-ua-platform": platformUA,
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": data.userAgent,
        "X-Amzn-Trace-Id": "Root=1-629e4d2d-69ff09fd3184deac1df68d18",
      },
    });
  });
};

// function to get yahoo search results from axios
const fetchYahooSearchData = async function (searchQuery) {
  // encode search query to represent UTF-8, URLs can only have certain characters from ASCII set
  const encodedSearch = encodeURI(searchQuery);

  // default ~5,6 results
  // ensures no out of bounds error/exception
  const numberOfResults = "&n=6";

  // wrap inside OPTIONS function callback to return request headers
  return OPTIONS().then(async function (data) {
    // bing search data with axios
    const yahooSearchData = await axios.get(
      `https://search.yahoo.com/search?p=${encodedSearch}${numberOfResults}`,
      data
    );
    // new bing search data promise
    const newYahooSearchDataPromise = await yahooSearchData.data;

    return { promise: newYahooSearchDataPromise, requestHeader: data };
  });
};

// helper function for search function
const helperConvertToWord = function (input) {
  var returnString = input.toLowerCase();
  returnString = returnString.replace("+", "p");
  returnString = returnString.replace("#", "sharp");
  returnString = returnString.replace("-", "minus");
  returnString = returnString.replace("*", "star");
  return returnString;
};

// scraps the top title and links for search query with programming language as a parameter
// return array of result objects from yahoo search data
const buildYahooResultObject = async function (searchQuery, pLanguage) {
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

  // calls fetchYahooSearchData from axios (promise)
  const searchData = fetchYahooSearchData(searchQuery + " " + encodedPLanguage);

  return searchData.then(async function (data) {
    // load markup with cheerio
    let $ = cheerio.load(data.promise);

    // delete all javascript
    $("script").remove();
    
    // delete span class holding routes for titles
    $("span.d-ib.p-abs.t-0.l-0.fz-14.lh-20.fc-obsidian.wr-bw.ls-n.pb-4").remove();

    // building result object
    // array : store data points
    const links = [];
    const titles = [];
    const captions = [];

    // gets link from href attr
    // loop through li tag, first div child, first div child, h3 tag, a getting hyperlink
    $("li > div:nth-child(1) > div:nth-child(1) > h3 > a").each((index, element) => {
      links[index] = $(element).attr("href");
    }); 
    
    // loop through li tag, first div child, first div child, h3 tag, a getting text (span class before is deleted)
    $("li > div:nth-child(1) > div:nth-child(1) > h3 > a").each((index, element) => {
      titles[index] = $(element).text();
    });
    
    // loop through li tag, first div child, third div child, p, a getting text
    $("li > div > div:nth-child(3) > p").each((index, element) => {
      captions[index] = $(element).text();
    });

    // fill array with result object
    // TODO: current link is yahoo redirect url, handled in fetch functions below
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

// helper function to construct original link from yahoo redirect link
const helperLinkBuilder = async function (yahooRedirectLink) {
  return await axios
    .get(yahooRedirectLink, OPTIONS)
    .then(response => {
      const $ = cheerio.load(response.data).html();
      let root = HTMLParser.parse($);
      let link = String(root.getElementsByTagName("script"));
      let index1 = link.indexOf(`("`); 
      let index2 = link.indexOf(`")`); 

      return link.substring(index1+2, index2);
  }).catch((error) => {
    return `${ERROR_MESSAGE_R} ${error}`;
  });
}

// function to get data from the first link in the yahoo result object from axios
const fetchFirstYahooResultPage = async function (searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from yahoo
  const resultsYahoo = buildYahooResultObject(searchQuery, pLanguage);

  await sleep(1000);
  // data is array of yahoo result objects
  // makes call to axios to get data from the first link of yahoo result object
  // makes a callback to helper function to get actual url from the yahoo redirect url
  return await resultsYahoo.then(async function (data) {
    return helperLinkBuilder(data.results[0].link).then(async function (linkDataCB) {
      await sleep(1000);

      // console.log("yahoo linkstate 1", data.results[0].link);

      // link data from array of yahoo result object with axios
      const linkData = await axios.get(linkDataCB, OPTIONS);

      // new link data promise
      const linkDataPromise = await linkData.data;

      return {
        source: data.results[0].link,
        title: data.results[0].title,
        linkPromise: linkDataPromise,
        requestHeader: data.requestHeader,
      };
    });
  });
};

// function to get data from the second link in the yahoo result object from axios
const fetchSecondYahooResultPage = async function (searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from yahoo
  const resultsYahoo = buildYahooResultObject(searchQuery, pLanguage);

  await sleep(1000);
  // data is array of yahoo result objects
  // makes call to axios to get data from the second link of yahoo result object
  // makes a callback to helper function to get actual url from the yahoo redirect url
  return await resultsYahoo.then(async function (data) {
    return helperLinkBuilder(data.results[1].link).then(async function (linkDataCB) {
      await sleep(1000);

      // console.log("yahoo linkstate 2", data.results[1].link);

      // link data from array of yahoo result object with axios
      const linkData = await axios.get(linkDataCB, OPTIONS);

      // new link data promise
      const linkDataPromise = await linkData.data;

      return {
        source: data.results[1].link,
        title: data.results[1].title,
        linkPromise: linkDataPromise,
        requestHeader: data.requestHeader,
      };
    });
  });
};

// function to get data from the third link in the yahoo result object from axios
const fetchThirdYahooResultPage = async function (searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from yahoo
  const resultsYahoo = buildYahooResultObject(searchQuery, pLanguage);

  await sleep(1000);
  // data is array of yahoo result objects
  // makes call to axios to get data from the third link of yahoo result object
  // makes a callback to helper function to get actual url from the yahoo redirect url
  return await resultsYahoo.then(async function (data) {
    return helperLinkBuilder(data.results[2].link).then(async function (linkDataCB) {
      await sleep(1000);

      // console.log("yahoo linkstate 3", data.results[2].link);

      // link data from array of yahoo result object with axios
      const linkData = await axios.get(linkDataCB, OPTIONS);

      // new link data promise
      const linkDataPromise = await linkData.data;

      return {
        source: data.results[2].link,
        title: data.results[2].title,
        linkPromise: linkDataPromise,
        requestHeader: data.requestHeader,
      };
    });
  });
};

// function to get data from the fourth link in the yahoo result object from axios
const fetchFourthYahooResultPage = async function (searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from yahoo
  const resultsYahoo = buildYahooResultObject(searchQuery, pLanguage);

  await sleep(1000);
  // data is array of yahoo result objects
  // makes call to axios to get data from the third link of yahoo result object
  // makes a callback to helper function to get actual url from the yahoo redirect url
  return await resultsYahoo.then(async function (data) {
    return helperLinkBuilder(data.results[3].link).then(async function (linkDataCB) {
      await sleep(1000);

      // console.log("yahoo linkstate 4", data.results[3].link);

      // link data from array of yahoo result object with axios
      const linkData = await axios.get(linkDataCB, OPTIONS);

      // new link data promise
      const linkDataPromise = await linkData.data;

      return {
        source: data.results[3].link,
        title: data.results[3].title,
        linkPromise: linkDataPromise,
        requestHeader: data.requestHeader,
      };
    });
  });
};

// function to get data from the fifth link in the yahoo result object from axios
const fetchFifthYahooResultPage = async function (searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from yahoo
  const resultsYahoo = buildYahooResultObject(searchQuery, pLanguage);

  await sleep(1000);
  // data is array of yahoo result objects
  // makes call to axios to get data from the third link of yahoo result object
  // makes a callback to helper function to get actual url from the yahoo redirect url
  return await resultsYahoo.then(async function (data) {
    return helperLinkBuilder(data.results[4].link).then(async function (linkDataCB) {
      await sleep(1000);

      // console.log("yahoo linkstate 5", data.results[4].link);

      // link data from array of yahoo result object with axios
      const linkData = await axios.get(linkDataCB, OPTIONS);

      // new link data promise
      const linkDataPromise = await linkData.data;

      return {
        source: data.results[4].link,
        title: data.results[4].title,
        linkPromise: linkDataPromise,
        requestHeader: data.requestHeader,
      };
    });
  });
};

// returns "code" object
// function to start scraping data from result object links, takes in searchQuery, pLanguage, and state of result link
// linkState is an int that represents which link in the result array (1, 2, 3, 4, 5)
// default will be the code object from yahoo search result object
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
    const yahooPageOne = fetchFirstYahooResultPage(searchQuery, pLanguage);

    return yahooPageOne
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
        console.log(error);
        if (String(error.response).includes(CAPTCHA_MESSAGE)) {
          return CAPTCHA_ERROR;
        }
        return `${LINK_STATE_ERROR} at ls:${linkState}`;
      });
  } else if (linkState === "2") {
    const yahooPageTwo = fetchSecondYahooResultPage(searchQuery, pLanguage);

    return yahooPageTwo
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
    const yahooPageThree = fetchThirdYahooResultPage(searchQuery, pLanguage);

    return yahooPageThree
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
    const yahooPageFour = fetchFourthYahooResultPage(searchQuery, pLanguage);

    return yahooPageFour
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
    const yahooPageFive = fetchFifthYahooResultPage(searchQuery, pLanguage);

    return yahooPageFive
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
  buildYahooResultObject,
  getResultDataLinks,
};