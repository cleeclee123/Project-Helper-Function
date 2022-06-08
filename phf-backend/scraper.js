const cheerio = require("cheerio");
const axios = require("axios");
const promise = require("promise");
const Captcha = require("2captcha");

// write request header interface for google 
const OPTIONS = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
  },
};

// function to get google search results from axios
async function fetchGoogleSearchData(searchQuery) {
  // encode search query to represent UTF-8, URLs can only have certain characters from ASCII set
  const encodedSearch = encodeURI(searchQuery);

  // default language english
  const languageSearch = "&hl=en";

  // default united states
  const countrySearch = "&gl=us";

  // default 3 results
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
}

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
  edge case where bing's top choices have different html classes, 10 is an arbitrary number to \
  ensure that enough b_algo classes are generated
  */
  const numberOfResults = "&count=9";

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
    let $ = cheerio.load(data);

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


/* FUNCTIONS TO IMPLEMENT */

/* LOW-PRIORITY: Captcha Solver Function */
// function to solve recaptcha/captcha


// function to get data from the first link in the google result object from axios
async function fetchFirstGoogleResultPage(searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from google
  const resultsGoogle = getGoogleSearchLinksLang(searchQuery, pLanguage);

  // data is array of google result objects
  // makes call to axios to get data from the first link of google result object
  return resultsGoogle.then(async function(data) {
    // check for captcha
    const message = "Our systems have detected unusual traffic from your computer network";
    const captcha = "captcha";

    // link data from array of result object with axios
    const linkData = await axios.get(data[0].link, OPTIONS);
                          
    // new link data promise
    const linkDataPromise = await linkData.data;

    return linkDataPromise;
  });
}

// checks if google redirects to captcha page
async function checkCaptchaGoogleOne(searchQuery, pLanguage) {
  let state = false
  const pageOne = fetchFirstGoogleResultPage(searchQuery, pLanguage);
  return pageOne.catch(function(error) {
    const message = "Our systems have detected unusual traffic from your computer network.";
    if (error.response.data.includes(message)) {
      state = true;
    }
    return state;
  });
}

// function to get data from the second link in the google result object from axios
async function fetchSecondGoogleResultPage(searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from google
  const resultsGoogle = getGoogleSearchLinksLang(searchQuery, pLanguage);

  // data is array of google result objects
  // makes call to axios to get data from the second link of google result object
  return resultsGoogle.then(async function(data) {

    // link data from array of result object with axios
    const linkData = await axios.get(data[1].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return linkDataPromise;
  });
}

// checks if google redirects to captcha page
async function checkCaptchaGoogleTwo(searchQuery, pLanguage) {
  let state = false;
  const pageTwo = fetchSecondGoogleResultPage(searchQuery, pLanguage);
  return pageTwo.catch(function(error) {
    const message = "Our systems have detected unusual traffic from your computer network";
    if (error.response.data.includes(message)) {
      state = true;
    }
    return state;
  });
}

// function to get data from the third link in the google result object from axios
async function fetchThirdGoogleResultPage(searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from google
  const resultsGoogle = getGoogleSearchLinksLang(searchQuery, pLanguage);

  // data is array of google result objects
  // makes call to axios to get data from the third link of google result object
  return resultsGoogle.then(async function(data) {

    // link data from array of google result object with axios
    const linkData = await axios.get(data[2].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return linkDataPromise;
  });
}

// checks if google redirects to captcha page
async function checkCaptchaGoogleThree(searchQuery, pLanguage) {
  let state = false;
  const pageThree = fetchThirdGoogleResultPage(searchQuery, pLanguage);
  return pageThree.catch(function(error) {
    const message = "Our systems have detected unusual traffic from your computer network";
    if (error.response.data.includes(message)) {
      state = true;
    }
    return state;
  });
}

// function to get data from the first link in the bing result object from axios
async function fetchFirstBingResultPage(searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from bing
  const resultsBing = getBingSearchLinksLang(searchQuery, pLanguage);

  // data is array of bing result objects
  // makes call to axios to get data from the first link of bing result object
  return resultsBing.then(async function(data) {

    // link data from array of bing result object with axios
    const linkData = await axios.get(data[0].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return linkDataPromise;
  });
}

// checks if bing redirects to captcha page
async function checkCaptchaBingOne(searchQuery, pLanguage) {
  let state = false;
  const pageOne = fetchFirstBingResultPage(searchQuery, pLanguage);
  return pageOne.catch(function(error) {
    const message = "Our systems have detected unusual traffic from your computer network";
    if (error.response.data.includes(message)) {
      state = true;
    }
    return state;
  });
}

// function to get data from the second link in the bing result object from axios
async function fetchSecondBingResultPage(searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from bing
  const resultsBing = getBingSearchLinksLang(searchQuery, pLanguage);

  // data is array of bing result objects
  // makes call to axios to get data from the second link of bing result object
  return resultsBing.then(async function(data) {

    // link data from array of result object with axios
    const linkData = await axios.get(data[1].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return linkDataPromise;
  });
}

// checks if bing redirects to captcha page
async function checkCaptchaBingTwo(searchQuery, pLanguage) {
  let state = false;
  const pageTwo = fetchSecondBingResultPage(searchQuery, pLanguage);
  return pageTwo.catch(function(error) {
    const message = "Our systems have detected unusual traffic from your computer network";
    if (error.response.data.includes(message)) {
      state = true;
    }
    return state;
  });
}

// function to get data from the third link in the bing result object from axios
async function fetchThirdBingResultPage(searchQuery, pLanguage) {
  // array of result objects, holds the top three results (link, title) from bing
  const resultsBing = getBingSearchLinksLang(searchQuery, pLanguage);

  // data is array of bing result objects
  // makes call to axios to get data from the third link of bing result object
  return resultsBing.then(async function(data) {

    // link data from array of bing result object with axios
    const linkData = await axios.get(data[2].link, OPTIONS);

    // new link data promise
    const linkDataPromise = await linkData.data;

    return linkDataPromise;
  });
}

// checks if bing redirects to captcha page
async function checkCaptchaBingThree(searchQuery, pLanguage) {
  let state = false;
  const pageThree = fetchThirdBingResultPage(searchQuery, pLanguage);
  return pageThree.catch(function(error) {
    const message = "Our systems have detected unusual traffic from your computer network";
    if (error.response.data.includes(message)) {
      state = true;
    }
    return state;
  });
}

// returns "code" object
// function to start scraping data from result object links, takes in searchQuery, pLanguage, and state of result link
// linkState is an int that repersents which link in the result array (1, 2, 3)
// linkState will be a dropdown menu/next button on the frontend
// default will be the code object from google search result object
async function getResultDataLinks(searchQuery, pLanguage, linkState) {
  // page data from corresponding link in google result object array
  const googlePageOne = fetchFirstGoogleResultPage(searchQuery, pLanguage);
  const googlePageTwo = fetchSecondGoogleResultPage(searchQuery, pLanguage);  
  const googlePageThree = fetchThirdGoogleResultPage(searchQuery, pLanguage);

  // captcha state for all google pages
  const googlePageOneCaptchaState = checkCaptchaGoogleOne(searchQuery, pLanguage);
  const googlePageTwoCaptchaState = checkCaptchaGoogleTwo(searchQuery, pLanguage);  
  const googlePageThreeCaptchaState = checkCaptchaGoogleThree(searchQuery, pLanguage);

  // page data from corresponding link in bing result object array
  const bingPageOne = fetchFirstBingResultPage(searchQuery, pLanguage);
  const bingPageTwo = fetchSecondBingResultPage(searchQuery, pLanguage);  
  const bingPageThree = fetchThirdBingResultPage(searchQuery, pLanguage);

  // captcha state for all bing pages
  const bingPageOneCaptchaState = await checkCaptchaBingOne(searchQuery, pLanguage);
  const bingPageTwoCaptchaState = await checkCaptchaBingTwo(searchQuery, pLanguage);  
  const bingPageThreeCaptchaState = await checkCaptchaBingThree(searchQuery, pLanguage);

  googlePageOneCaptchaState.then(function(state) {
    console.log(state);
  })


  // linkState will scrap the corresponding website and checks captcha state
  // return "code" object that represents the original searchQuery and corresponding programming language
  if ((linkState === 1) && (googlePageOneCaptchaState !== true)) {
    return googlePageOne.then(async function(data) {
      // load markup with cheerio
      let $ = cheerio.load(data);

      // build "code" object
      let code = [];
      $("code:first").each((index, element) => {
        code[index] = $(element).text();
      });
      
      return code;
    });
  } else if ((linkState === 1) && (bingPageOneCaptchaState !== true)) {
    return bingPageOne.then(async function(data) {
      // load markup with cheerio
      let $ = cheerio.load(data);

      // build "code" object
      let code = [];
      $("code").each((index, element) => {
        code[index] = $(element).text();
      });
      
      return code;
    });
  } else if ((linkState === 2) && (googlePageTwoCaptchaState !== true)) {
    return googlePageTwo.then(async function(data) {
      // load markup with cheerio
      let $ = cheerio.load(data);

      // build "code" object
      let code = [];
      $("code").each((index, element) => {
        code[index] = $(element).text();
      });
      
      return code;
    });
  } else if ((linkState === 2) && (bingPageTwoCaptchaState !== true)) {
    return bingPageTwo.then(async function(data) {
      // load markup with cheerio
      let $ = cheerio.load(data);

      // build "code" object
      let code = [];
      $("code").each((index, element) => {
        code[index] = $(element).text();
      });
      
      return code;
    });
  } else if (linkState === 3 && (googlePageThreeCaptchaState !== true)) {
    return googlePageThree.then(async function(data) {
      // load markup with cheerio
      let $ = cheerio.load(data);

      // build "code" object
      let code = [];
      $("code").each((index, element) => {
        code[index] = $(element).text();
      });
      
      return code;
    });
  } else if ((linkState === 3) && (bingPageThreeCaptchaState !== true)) {
    return bingPageThree.then(async function(data) {
      // load markup with cheerio
      let $ = cheerio.load(data);

      // build "code" object
      let code = [];
      $("code").each((index, element) => {
        code[index] = $(element).text();
      });
      
      return code;
    });
  } else if (googlePageOneCaptchaState === true
            && googlePageTwoCaptchaState === true
            && googlePageThreeCaptchaState === true
            && bingPageOneCaptchaState === true
            && bingPageTwoCaptchaState === true
            && bingPageThreeCaptchaState === true) {
              throw new Error("Captcha Error");
            }
    else if (googlePageOneCaptchaState === true
            && googlePageTwoCaptchaState === true
            && googlePageThreeCaptchaState === true) {
              throw new Error("Google Captcha Error");
            }
    else if (bingPageOneCaptchaState === true
            && bingPageTwoCaptchaState === true
            && bingPageThreeCaptchaState === true) {
              throw new Error("Bing Captcha Error");
            }
  else {
    throw new Error("Link State Error")
  }
}

/* FUNCTIONS TO IMPLEMENT */

// data cleaning function, comes out very messy in some cases 

// http server proxy (in server file)


// testing
const codeg = fetchFirstGoogleResultPage("is palindrome", "c++");
const codeb = fetchFirstBingResultPage("is palindrome", "c++");
codeg.then(function(data) {

}).catch(function(error) {
  const message = "Our systems have detected unusual traffic from your computer network";
  if (error.response.data.includes(message)) {
    codeb.then(function(datab) {
      console.log(datab);
    })
  }
})

/*

<div id="infoDiv" style="display:none; background-color:#eee; padding:10px; margin:0 0 15px 0; line-height:1.4em;">\n' +
  
'This page appears when Google automatically detects requests coming from your computer network which appear to be in violation of the 
<a href="//www.google.com/policies/terms/">Terms of Service</a>. The block will expire shortly after those requests stop.  
In the meantime, solving the above CAPTCHA will let you continue to use our services.
<br><br>This traffic may have been sent by malicious software, a browser plug-in, or a script that sends automated requests.  
If you share your network connection, ask your administrator for help &mdash; a different computer using the same IP address may be responsible.  
<a href="//support.google.com/websearch/answer/86640">Learn more</a><br><br>
Sometimes you may be asked to solve the CAPTCHA if you are using advanced terms that robots are known to use, or sending requests very quickly.\n' +


*/
