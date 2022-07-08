import React, { useState } from "react";
import Editor from "./Editor";
import Footer from "./Footer";
import "./styles/Home.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("");

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

  return (
    <div className="home-container">
      <div className="content-code">
        <div className="code-search">
          <div className="code-dropdown">
            <form id="form" role="select" onSubmit={handleClick}>
              <label for="lang">Choose a Language:</label>
              &nbsp;&nbsp;
              <select name="lang" id="lang" onChange={handleChangeLang}>
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
      </div>

      <div className="out-ph"><h1> Output/Compiler Here </h1></div>

    </div>
  );
}
