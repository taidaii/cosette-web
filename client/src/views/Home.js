import { Container, Row, Col, Dropdown, Stack, Tab, Tabs } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { useState } from 'react';

import "./styles/Home.css"

export default function () {

  const [isLoading, setLoading] = useState(false);
  const [tabKey, setTabKey] = useState('ta');

  const handleClick = () => setLoading(true);

  return (
    <>
      <Container className='home-center'>
        
        <Tabs
          activeKey={tabKey}
          onSelect={k=>setTabKey(k)}
          className="mb-3"
        >
          <Tab eventKey="ta" title="TA's View"></Tab>
          <Tab eventKey="student" title="Student's View">
          </Tab>
        </Tabs>

        <Row className='btn-row'>
          <Col>
            <Stack direction="horizontal" gap={2}>
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic" variant="outline-primary">
                  Template
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Hello World</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            
              <Button variant="outline-primary">
                Upload
              </Button>
            
              <Button variant="link">
                Manage
              </Button>
            </Stack>
          </Col>
          <Col>
            <Button variant="success" onClick={!isLoading ? handleClick : null}>
              Verify
            </Button>
          </Col>
        </Row>
        <Row>
          <Col style={{width: "20%"}}>
            <Stack gap={4}>
              <CodeMirror
                className="bg-light border"
                value="CREATE TABLE hello_world {};"
                height={tabKey == 'ta' ? "190px" : "298px"}
                extensions={[sql({})]}
                onChange={(value, viewUpdate) => {
                  console.log('value:', value);
                }}
              />
              {
                tabKey == 'ta' ?
                <CodeMirror
                className="bg-light border"
                  value="SELECT * FROM hello_world;"
                  height="190px"
                  extensions={[sql({})]}
                  onChange={(value, viewUpdate) => {
                    console.log('value:', value);
                  }}
                />
                : null
              }
              <CodeMirror
                className="bg-light border"
                value="SELECT * FROM hello_world;"
                height={tabKey == 'ta' ? "190px" : "298px"}
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
              {isLoading ? <div id="feedback">Two queries are equivalent!</div> : null}
            </div>
          </Col>
        </Row>

      </Container>         
    </>
  );
};