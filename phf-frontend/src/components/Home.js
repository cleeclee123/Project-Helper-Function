import React, { useState } from 'react';
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
  }

  // onClick handler
  const handleClick = (event) => {
    event.preventDefault();
    console.log(searchQuery);
    console.log(language);
  }

  return (
    <div className="home-container">
      <div className="content-welcome">
        <h1> <a id="home-id"> Welcome to Project Helper Function!</a> </h1> <br></br> 
      </div>
      <div className="content-info">
        <h3> <a id="about-id"> Powered by Google's and Bing's Search Engines</a> </h3> <br></br>
      </div>
      <div className="content-code">
        <h3> <a id="code-id"> Try It Out Here! </a> </h3> <br></br>

        <div className="code-dropdown">
          <form id="form" role="select">
            <label for="lang">Choose a Language:</label>
            <select name="lang" id="lang" >
              <optgroup label="Programming Languages">
                <option value="html">HTML</option>
                <option value="javascript">JavaScript</option>
                <option value="html">Java</option>
                <option value="cplusplus">C++</option>
                <option value="c">C</option>
                <option value="csharp">C#</option>
                <option value="python">Python</option>
                <option value="golang">GoLang</option>
                <option value="html">HTML</option>
                <option value="typescript">TypeScript</option>
                <option value="typescript">Rust</option>
                <option value="typescript">Kotlin</option>
              </optgroup>
            </select>
          </form>
        </div>
          
        <div className="code-search-other">
          <form id="form" role="search">
            <input
              type="text"
              placeholder="Other Langauge"
              aria-label="Set users plang"
              onChange={handleChangeLang}
              value={language}
            /> <br></br>
            <input 
              type="text"
              placeholder="Search here"
              aria-label="Set users search query"
              onChange={handleChangeQuery}
              value={searchQuery}
            />
            <button onClick={handleClick}> Search </button>
          </form>
        </div>
      </div>

    </div>
  )
}
