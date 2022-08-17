import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Editor from "@monaco-editor/react";

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
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Editor
          height="50vh"
          defaultValue="// some comment"
          theme="vs-dark"
          /* language={language}
          value={codeObjectResult}
          onChange={handleEditorChange} */
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

  return (
    <div className="dash-container">
      <div className="dash-results-wrapper">
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" />
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Button variant="primary" onClick={() => setModalShow(true)}>
              Go somewhere
            </Button>
          </Card.Body>
        </Card>

        <VerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          test="test"
        />
      </div>
    </div>
  );
}
