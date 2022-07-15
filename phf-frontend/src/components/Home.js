import React, { useState } from "react";
import axios from "axios";
import "./styles/Home.css";

import Editor from "@monaco-editor/react";

export default function Home() {
  const [searchEngine, setSearchEngine] = useState("google");
  const [searchQuery, setSearchQuery] = useState("How to print Hello World");
  const [language, setLanguage] = useState("javascript");
  const [linkState, setLinkState] = useState(1);
  const [codeObjectResult, setCodeObjectResult] = useState(`console.log("Hello World")`);
  const [buttonText, setButtonText] = useState("Search"); 

  // hnadle state for engine by dropdown
  const handleChangeEngine = (event) => {
    event.preventDefault();
    setSearchEngine(event.target.value);
  };

  // handle state for language by dropdown
  const handleChangeLang = (event) => {
    event.preventDefault();
    setLanguage(event.target.value);
    setLinkState(1);
    setButtonText("Search");
  };

  // handle state for search query by input
  const handeChangeSearchQuery = (event) => {
    event.preventDefault();
    setSearchQuery(event.target.value);
    setLinkState(1);
    setButtonText("Search");
  }

  // google code object fetcher
  const fetchGoogleCodeObj = async function () {
    const params = {
      sq: searchQuery,
      lang: language,
      ls: linkState.toString(),
    };
    return await axios
      .get("http://localhost:8080/google", { params })
      .then((response) => {
        // console.log(response);
        // return response;
        setCodeObjectResult(response.data.toString());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // bing code object fetcher
  const fetchBingCodeObj = async function () {
    const params = {
      sq: searchQuery,
      lang: language,
      ls: linkState.toString(),
    };
    return await axios
      .get("http://localhost:8080/bing", { params })
      .then((response) => {
        // console.log(response);
        // return response;
        setCodeObjectResult(response.data.toString());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // onClick handler
  // handle which scraper to run given search engine state
  const handleClick = (event) => {
    event.preventDefault();
    setButtonText("Next Answer");
    setLinkState(linkState + 1);
    if (searchEngine === "google") {
      fetchGoogleCodeObj();
    } else if (searchEngine === "bing") {
      fetchBingCodeObj();
    }
  };

  // handles linkstate for getting other search results
  if (linkState > 3) {
    setLinkState(1);
  }

  // test editor 
  function handleEditorChange(value, event) {
    console.log(value);
  }

  const getOutput = async function () {
    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: {base64_encoded: 'true', fields: '*'},
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': 'fb89168a22mshfed78d6b1a25269p11f506jsn545597322244',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      data: '{"language_id":74,"source_code":"Y29uc29sZS5sb2coImhlbGxvIHdvcmxkIik=","stdin":"SnVkZ2Uw"}'
    };
    
    return await axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.error(error);
      });
  }

  // getOutput();
  // console.log(searchEngine);
  // console.log(searchQuery);
  // console.log(language);
  // console.log(linkState);

  // console.log(codeObjectBing);
  // console.log(codeObjectGoogle);
  // console.log(codeObjectResult);

  return (
    <div className="home-container">
      <div className="content-code">
        <div className="code-search">
          <label htmlFor="lang">Choose a Search Engine:</label>
          &nbsp;&nbsp;
          <select
            className="engine-select"
            name="engine"
            id="engine"
            onChange={handleChangeEngine}
          >
            <optgroup label="Search Engines">
              <option value="google">Google</option>
              <option value="bing">Bing</option>
              <option value="duckduckgo">Duck Duck Go</option>
              <option value="yahoo">Yahoo</option>
            </optgroup>
          </select>
          <div className="code-dropdown">
            <form id="form" role="select" onSubmit={handleClick}>
              <label htmlFor="lang">Choose or Type a Language:</label>
              &nbsp;&nbsp;
              <select
                className="lang-select"
                name="lang"
                id="lang"
                onChange={handleChangeLang}
              >
                <optgroup label="Programming Languages">
                  <option value="javascript">JavaScript</option>
                  <option value="html">HTML</option>
                  <option value="java">Java</option>
                  <option value="c plus plus">C++</option>
                  <option value="c">C</option>
                  <option value="csharp">C#</option>
                  <option value="python">Python</option>
                  <option value="golang">GoLang</option>
                  <option value="html">HTML</option>
                  <option value="typescript">TypeScript</option>
                  <option value="rust">Rust</option>
                  <option value="kotlin">Kotlin</option>
                </optgroup>
              </select>
              &nbsp;&nbsp;&nbsp;
              <input
                type="text"
                placeholder="Other Language"
                aria-label="Set users plang"
                onChange={handleChangeLang}
                value={language}
              />
            </form>
          </div>
          <div className="code-query-wrapper">
            <div className="code-search">
              <form id="form" role="search">
                <input
                  className="search-term"
                  type="text"
                  placeholder="Search here"
                  aria-label="Set users search query"
                  value={searchQuery}
                  onChange={handeChangeSearchQuery}
                />
                <button
                  onClick={handleClick}
                  type="submit"
                  className="search-button"
                  id="searchButton"
                >
                  { buttonText }
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="code-editor">
          <Editor
            height="70vh"
            defaultValue="// some comment"
            theme="vs-dark"
            language={language}
            value={codeObjectResult}
            onChange={handleEditorChange}
          />
        </div>
        {/* Don't really need because Search Button handles linkState */}
        {/* <div className="code-nextAnswer">
          <button className="next-button" onClick={handleNextAnswer}>Next Answer: {linkState}</button>
        </div> */}
      </div>

      {/* <div className="out-ph">
        <h1> Output/Compiler Here </h1>
      </div> */}
    </div>
  );
}
