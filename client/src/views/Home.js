/* eslint-disable import/no-anonymous-default-export */
import { Container, Row, Col, Dropdown, Stack, Spinner, Table, Tab, Tabs } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { useState } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'html-react-parser'; 

import "./styles/Home.css"

export default function () {

  const [isLoading, setLoading] = useState(false);
  const [tabKey, setTabKey] = useState('ta');
  const [createTableStatement, setCreateTableStatement] = useState("CREATE TABLE indiv_sample_nyc(\n cmte_id INT,\n transaction_amt INT,\n name VARCHAR(10),\n str_name VARCHAR(10)\n );");
  const [taSubmission, setTaSubmission] = useState("SELECT * FROM indiv_sample_nyc WHERE cmte_id = 1 AND name LIKE '%test%' AND str_name LIKE '%test3%';");
  const [studentSubmission, setStudentSubmission] = useState("SELECT * FROM indiv_sample_nyc WHERE cmte_id = 2 AND name LIKE '%test%' AND str_name LIKE '%test3%';");
  const [resultStatus, setResultStatus] = useState("");
  const [resultLog, setResultLog] = useState("");
  const [resultTableCols, setResultTableCols] = useState("");
  const [resultTableRows, setResultTableRows] = useState("");

  const handleClick = async() => {
    setLoading(true);
    setResultStatus("");
    setResultLog("");
    setResultTableCols("");
    setResultTableRows("");
    const result = await axios.post('http://localhost:5000/check', {
      // schema: "CREATE TABLE indiv_sample_nyc(\n cmte_id INT,\n transaction_amt INT,\n name VARCHAR(10),\n str_name VARCHAR(10)\n );",
      schema: createTableStatement,
      ta_input: taSubmission,
      student_input: studentSubmission
    });
    console.log(result);
    const { status, test_log } = result.data;
    setResultStatus(status);
    setResultLog(test_log);
    if (test_log.indexOf("Table") !== -1) {
      // "(Table \"INDIV_SAMPLE_NYC\" '(\"CMTE_ID\" \"TRANSACTION_AMT\" \"NAME\" \"STR_NAME\") '(((1 0 \"0\" \"0\") . 1)))↵"
      const tblName = test_log.substring(test_log.indexOf("Table")+7, test_log.indexOf("\"", test_log.indexOf("Table \"") + 7));
      console.log(tblName);
      const colNames = test_log.substring(test_log.indexOf("(", 1)+1, test_log.indexOf(")", 1)).replaceAll("\"", "").split(" ");
      let tblCols = "<th>#</th>";
      for (let name of colNames) tblCols += "<th>" + name + "</th>";
      setResultTableCols(tblCols);
      console.log(colNames);
      const recordsPerRow = test_log.substring(test_log.indexOf("(((")+3, test_log.indexOf(")", test_log.indexOf("((("))).split(" ");
      console.log(recordsPerRow);
      const recordNumPerRow = test_log.substring(test_log.indexOf(".", test_log.indexOf("((("))+2, test_log.indexOf(")))"));
      // TODO: Modify code if there're multiple different kinds of record
      for (let i=0; i<recordNumPerRow; i++) {
        let tblHtml = "<tr><td>" + i + "</td>";
        for (let record of recordsPerRow) tblHtml += "<td>" + record + "</td>";
        tblHtml += "</tr>";
        console.log(tblHtml);
        setResultTableRows(tblHtml);
      }
      console.log(recordNumPerRow);
      console.log(resultTableCols);
      console.log(resultTableRows);
    }
    setLoading(false);
  }

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
                height={tabKey == 'ta' ? "190px" : "298px"}
                value={createTableStatement}
                extensions={[sql({})]}
                onChange={(value, viewUpdate) => {
                  console.log('value:', value);
                  setCreateTableStatement(value);
                }}
              />
              {
                tabKey == 'ta' ?
                <CodeMirror
                className="bg-light border"
                  value={taSubmission}
                  height="190px"
                  extensions={[sql({})]}
                  onChange={(value, viewUpdate) => {
                    console.log('value:', value);
                    setTaSubmission(value);
                  }}
                />
                : null
              }
              <CodeMirror
                className="bg-light border"
                height={tabKey == 'ta' ? "190px" : "298px"}
                value={studentSubmission}
                extensions={[sql({})]}
                onChange={(value, viewUpdate) => {
                  console.log('value:', value);
                  setStudentSubmission(value);
                }}
              />
            </Stack>
          </Col>
          <Col>
            <div className='result'>
              <h3 style={{}}>Result</h3>
              {isLoading && <Spinner animation="border" role="isLoading">
                <span className="visually-hidden">Loading...</span>
              </Spinner>}
              <br></br>
              { (resultStatus === "EQ") && <Button variant="success" active>Equivalent</Button> }
              { (resultStatus === "NEQ") && <Button variant="danger" active>Not Equivalent</Button> }
              { (resultStatus === "Undecidable") && <Button variant="secondary" active>Not Decidable</Button> }
              <br></br>
              <br></br>
              { (resultTableRows !== "" && <p>The following table is the counterexample</p>)}
              { (resultTableRows !== "" && <Table striped bordered hover><thead><tr>{ReactHtmlParser(resultTableCols)}</tr></thead><tbody>{ReactHtmlParser(resultTableRows)}</tbody></Table>)}
              { (resultTableRows === "" && resultLog) }
            </div>
          </Col>
        </Row>

      </Container>         
    </>
  );
};