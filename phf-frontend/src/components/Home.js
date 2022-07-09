import React, { useState } from "react";
import Editor from "./Editor";
import axios from "axios";
import "./styles/Home.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [linkState, setLinkState] = useState(1);

  // handles linkstate for getting other search results
  if (linkState > 3) {
    setLinkState(1);
  }

  // onChange handler
  const handleChangeQuery = (event) => {
    setSearchQuery(event.target.value);
  };

  // onClick handler
  const handleChangeLang = (event) => {
    setLanguage(event.target.value);
  };

  // onClick handler
  const handleClick = (event) => {
    event.preventDefault();
    console.log(searchQuery);
    console.log(language);
  };

  // google code object fetcher
  const fetchGoogleCodeObj = async function() {
    const params = {
      sq: searchQuery, 
      lang: language,
      ls: linkState.toString(),
    }
    return await axios.get('http://localhost:8080/google', { params })
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error)
      });
  }

  // bing code object fetcher
  const fetchBingCodeObj = async function() {
    const params = {
      sq: searchQuery, 
      lang: language,
      ls: linkState.toString(),
    }
    return await axios.get('http://localhost:8080/bing', { params })
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error)
      });
  }

  return (
    <div className="home-container">
      <div className="content-code">
        <div className="code-search">
          <div className="code-dropdown">
            <form id="form" role="select" onSubmit={handleClick}>
              <label for="lang">Choose or Type a Language:</label>
              &nbsp;&nbsp;
              <select className="lang-select" name="lang" id="lang" onChange={handleChangeLang}>
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
                  onChange={handleChangeQuery}
                  value={searchQuery}
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
        <Editor/>
        <div className="code-nextAnswer">
          {linkState}
          <button onClick={() => setLinkState(linkState + 1)}>
            Next Answer
          </button> &nbsp;
          <button onClick={() => fetchGoogleCodeObj()}>
            Test API Google
          </button> &nbsp;
          <button onClick={() => fetchBingCodeObj()}>
            Test API Bing
          </button>
        </div>
      </div>

      <div className="out-ph"><h1> Output/Compiler Here </h1></div>

    </div>
  );
}
