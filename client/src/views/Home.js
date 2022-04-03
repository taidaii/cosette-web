import { Container, Row, Col, Dropdown, Stack } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { useState } from 'react';

import Header from "../components/Header"
import "./styles/Home.css"

export default function () {

  const [isLoading, setLoading] = useState(false);

  const handleClick = () => setLoading(true);

  return (
    <>
      <Header></Header>
      <Container className='home-center'>
        <Row className='btn-row'>
          <Col lg="1">
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                Template
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Hello World</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col lg="1">
            <Button>Upload</Button>
          </Col>
          <Col lg="4">
            <Button>Manage</Button>
          </Col>
          <Col lg="1">
            <Button variant="success" onClick={!isLoading ? handleClick : null}>
              Verify
            </Button>
          </Col>
        </Row>
        <Row>
          <Col style={{width: "20%"}}>
            <Stack gap={5}>
              <CodeMirror
                className="bg-light border"
                value="CREATE TABLE hello_world {};"
                height="180px"
                extensions={[sql({})]}
                onChange={(value, viewUpdate) => {
                  console.log('value:', value);
                }}
              />
              <CodeMirror
              className="bg-light border"
                value="SELECT * FROM hello_world;"
                height="180px"
                extensions={[sql({})]}
                onChange={(value, viewUpdate) => {
                  console.log('value:', value);
                }}
              />
              <CodeMirror
                className="bg-light border"
                value="SELECT * FROM hello_world;"
                height="180px"
                extensions={[sql({})]}
                onChange={(value, viewUpdate) => {
                  console.log('value:', value);
                }}
              />
            </Stack>
          </Col>
          <Col>
            <div className='result'>
              <h3 style={{}}>Result</h3>
              {isLoading ? <div id="feedback"> verified successfully!</div> : null}
            </div>
          </Col>
        </Row>
      </Container>         
    </>
  );
};