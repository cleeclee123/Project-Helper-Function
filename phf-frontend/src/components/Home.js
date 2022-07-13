import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
// import Editor from "./Editor";
import axios from "axios";
import "./styles/Home.css";

import Editor from "@monaco-editor/react";

export default function Home() {
  const [searchEngine, setSearchEngine] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [linkState, setLinkState] = useState(1);
  const [codeObjectResult, setCodeObjectResult] = useState("");
  const [codeObjectGoogle, setCodeObjectGoogle] = useState("");
  const [codeObjectBing, setCodeObjectBing] = useState("");

  // handles linkstate for getting other search results
  if (linkState > 3) {
    setLinkState(1);
  }

  // hnadle state for engine by dropdown
  const handleChangeEngine = (event) => {
    setSearchEngine(event.target.value);
  };

  // handle state for language by dropdown
  const handleChangeLang = (event) => {
    setLanguage(event.target.value);
  };

  const handleClickState = (event) => {
    event.preventDefault();
    setLinkState(linkState + 1);
  };

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
        setCodeObjectGoogle(response.data.toString());
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
        setCodeObjectBing(response.data.toString());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // onClick handler
  // handle which scraper to run given search engine state
  const handleClick = async (event) => {
    event.preventDefault();
    if (searchEngine === "google") {
      await fetchGoogleCodeObj();
      setCodeObjectResult(codeObjectGoogle);
      console.log("Search Engine: Google");
    } else if (searchEngine === "bing") {
      await fetchBingCodeObj();
      setCodeObjectResult(codeObjectBing);
      console.log("Search Engine: Bing");
    }
  };

  function handleEditorChange(value, event) {
    console.log(value);
  }

  console.log(searchEngine);
  console.log(searchQuery);
  console.log(language);
  console.log(linkState);

  // console.log(codeObjectBing);
  // console.log(codeObjectGoogle);

  return (
    <div className="home-container">
      <div className="content-code">
        <div className="code-search">
          <label for="lang">Choose a Search Engine:</label>
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
              <label for="lang">Choose or Type a Language:</label>
              &nbsp;&nbsp;
              <select
                className="lang-select"
                name="lang"
                id="lang"
                onChange={handleChangeLang}
              >
                <optgroup label="Programming Languages">
                  <option value="html">HTML</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cplusplus">C++</option>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={handleClick}
                  type="submit"
                  className="search-button"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="code-editor">
          <Editor
            height="60vh"
            defaultValue="// some comment"
            theme="vs-dark"
            language={language}
            value={codeObjectResult}
            onChange={handleEditorChange}
          />
        </div>
        <div className="code-nextAnswer">
          <button className="next-button" onClick={handleClickState}>Next Answer: {linkState}</button>
        </div>
      </div>

      <div className="out-ph">
        <h1> Output/Compiler Here </h1>
      </div>
    </div>
  );
}
