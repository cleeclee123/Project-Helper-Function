import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Editor from "@monaco-editor/react";
import axios from "axios";
import useWindowDimensions from "../components/Dimensions";
import "./styles/Dashboard.css";

function VerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.heading}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Editor
          height="50vh"
          defaultValue="// some comment"
          theme="vs-dark"
          language={props.language}
          value={props.value}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function Dashboard() {
  const [modalShow, setModalShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("hello world");
  const [language, setLanguage] = useState("javascript");

  const [googleSearchResults, setGoogleSearchResults] = useState([]);
  const [bingSearchResults, setBingSearchResults] = useState([]);
  const [yahooSearchResults, setYahooSearchResults] = useState([]);

  const [finalSearchResults, setFinalSearchResults] = useState([]);
  const [codeObject, setCodeObject] = useState("");

  const { height, width } = useWindowDimensions();

  // google route
  const fetchGoogleResults = async () => {
    const params = {
      sq: searchQuery,
      lang: language,
    };
    axios
      .get("http://localhost:8080/googlelinks", { params })
      .then((response) => {
        const shadowVar = response.data.results;
        setGoogleSearchResults(shadowVar);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // bing route
  const fetchBingResults = async () => {
    const params = {
      sq: searchQuery,
      lang: language,
    };
    axios
      .get("http://localhost:8080/binglinks", { params })
      .then((response) => {
        const shadowVar = response.data.results;
        setBingSearchResults(shadowVar);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // yahoo route
  const fetchYahooResults = async () => {
    const params = {
      sq: searchQuery,
      lang: language,
    };
    axios
      .get("http://localhost:8080/yahoolinks", { params })
      .then((response) => {
        const shadowVar = response.data.results;
        setYahooSearchResults(shadowVar);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // using method from bing route (all the same anyways)
  const fetchCodeObject = async (link) => {
    const params = {
      link: link,
    };
    axios
      .get("http://localhost:8080/bingfromlink", { params })
      .then((response) => {
        const shadowVar = response.data.codeObject;
        setCodeObject(shadowVar);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFinalSearchResult = async () => {
    // await fetchGoogleResults();
    await fetchBingResults();
    await fetchYahooResults();

    const searchResultSet = new Set([
      ...googleSearchResults,
      ...bingSearchResults,
      ...yahooSearchResults,
    ]);

    setFinalSearchResults([...searchResultSet]);
  };

  useEffect(() => {
    if (!searchQuery || !language) {
      return setFinalSearchResults([]);
    }
    handleFinalSearchResult();
  }, [searchQuery, language]);

  console.log(finalSearchResults);
  
  // handle searchquery
  const handleSearchQuery = (event) => {
    event.preventDefault();
    setSearchQuery(event.target.value);
    setGoogleSearchResults([]);
    setBingSearchResults([]);
    setYahooSearchResults([]);
    setFinalSearchResults([]);
  };

  // handle state for language by dropdown
  const handleChangeLang = (event) => {
    event.preventDefault();
    setLanguage(event.target.value);
    setGoogleSearchResults([]);
    setBingSearchResults([]);
    setYahooSearchResults([]);
    setFinalSearchResults([]);
  };
  
  // handle search button (on click)
  const handleClick = async (event) => {
    event.preventDefault();
    await handleFinalSearchResult();
  };

  // util functions for card scroll
  function handleMaxHeight() {
    if (height > 900) {
      return "800";
    } else {
      return "500";
    }
  }
  const scrollStyle = {
    "overflow-y": "scroll",
    "max-height": `${String(handleMaxHeight())}px`,
  };

  // manual testing
  console.log(searchQuery);
  console.log(language);

  return (
    <div className="dash-container">
      <div className="code-search">
        <div className="code-dropdown">
          <form id="form" role="select">
            <label htmlFor="lang" className="dash-searchbar">
              Choose or Type in a Language:
            </label>
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
                <option value="cpp">C++</option>
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
        <div className="code-search">
          <form id="form" role="search">
            <input
              className="search-term"
              type="text"
              placeholder="Search here"
              aria-label="Set users search query"
              value={searchQuery}
              onChange={handleSearchQuery}
            />
            <button
              onClick={handleClick}
              type="submit"
              className="search-button"
              id="searchButtonid"
            >
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="dash-results-wrapper" style={scrollStyle}>
        <Row className="mx-2 row row-cols-3">
          {finalSearchResults?.map((element) => (
            <div className="dash-results">
              <Card style={{ width: "25rem", height: "20rem" }}>
                <Card.Img variant="top" />
                <Card.Body>
                  <Card.Title>{element.title}</Card.Title>
                  <Card.Text className="card-caption">
                    {String(element.caption).length === 0
                      ? "No Caption Avaliable"
                      : element.caption}
                  </Card.Text>
                </Card.Body>
                <Button
                  variant="primary"
                  onClick={() => {
                    setModalShow(true);
                    String(fetchCodeObject(element.link));
                  }}
                >
                  See the code
                </Button>
              </Card>

              <VerticallyCenteredModal
                show={modalShow}
                onHide={() => {
                  setModalShow(false);
                  setCodeObject("");
                }}
                test="test"
                language={language}
                value={String(codeObject)}
              />
            </div>
          ))}
        </Row>
      </div>
    </div>
  );
}
