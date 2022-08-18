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
          onChange={props.change}
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const { height, width } = useWindowDimensions();

  // handle comment icon
  function handleCommentIcon(currentLanguage) {
    if (currentLanguage === "python") {
      return "#";
    } else if (currentLanguage === "html") {
      return "< ! ╌";
    }
    return "//";
  }
  function endHTMLComment(currentLanguage) {
    if (currentLanguage === "html") {
      return "╌>";
    }
    return "";
  }

  // handle state for language by dropdown
  const handleChangeLang = (event) => {
    event.preventDefault();
    setLanguage(event.target.value);
  };

  // bing route
  useEffect(() => {
    const params = {
      sq: "hello world",
      lang: "javascript",
    };
    axios
      .get("http://localhost:8080/binglinks", { params })
      .then((response) => {
        setSearchResults(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
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
    "max-height": `${String(handleMaxHeight())}px`
  }

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
            />
            <button type="submit" className="search-button" id="searchButton">
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="dash-results-wrapper" style={scrollStyle}>
        <Row className="mx-2 row row-cols-3">
          {searchResults.map((element) => (
            <div className="dash-results">
              <Card style={{ width: "25rem", height: "20rem" }}>
                <Card.Img variant="top" />
                <Card.Body>
                  <Card.Title>{element.title}</Card.Title>
                  <Card.Text className="card-caption">
                    {element.caption}
                  </Card.Text>
                </Card.Body>
                <Button variant="primary" onClick={() => setModalShow(true)}>
                  See the code
                </Button>
              </Card>
              
              <VerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                test="test"
              />
            </div>
          ))}
           
        </Row>
      </div>
    </div>
  );
}
