/* eslint-disable import/no-anonymous-default-export */
import { Container, Row, Col, Dropdown, Stack, Spinner, Table, Tab, Tabs } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { EditorView } from "@codemirror/view";
import { useState } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'html-react-parser'; 
import { useNavigate } from 'react-router-dom';

import "./styles/Home.css"
import templates from '../utils/data/templates';

export default function Home() {

  const [isLoading, setLoading] = useState(false);
  const [tabKey, setTabKey] = useState('instructor');
  const [tmplKey, setTmplKey] = useState(0);
  const [createTableStatement, setCreateTableStatement] = useState(templates[tmplKey].createTableStatement);
  const [taSubmission, setTaSubmission] = useState(templates[tmplKey].taSubmission);
  const [studentSubmission, setStudentSubmission] = useState(templates[tmplKey].studentSubmission);
  const [resultStatus, setResultStatus] = useState("");
  const [resultLog, setResultLog] = useState("");
  const [resultTableCols, setResultTableCols] = useState("");
  const [resultTableRows, setResultTableRows] = useState("");

  const navigate = useNavigate();

  const handleTmplSelect = (k) => {
    setTmplKey(k);
    setCreateTableStatement(templates[k].createTableStatement);
    setTaSubmission(templates[k].taSubmission);
    setStudentSubmission(templates[k].studentSubmission);
  }

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
          className="mb-4"
        >
          <Tab eventKey="instructor" title="Instructor View"></Tab>
          <Tab eventKey="student" title="Student View">
          </Tab>
        </Tabs>

        <Row className='btn-row'>
          <Col>
            <Stack direction="horizontal" gap={2}>
              <Dropdown
                onSelect={handleTmplSelect}
              >
                <Dropdown.Toggle id="dropdown-basic" variant="outline-primary">
                  {templates[tmplKey].name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {
                    templates.map( 
                      (t, i) => 
                      <Dropdown.Item key={i} eventKey={i} > {t.name} </Dropdown.Item>
                    )
                  }
                </Dropdown.Menu>
              </Dropdown>
            
              <Button variant="link" onClick={() => navigate("/templates")} >
                Manage Templates
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
          <Col className="editor-area">
              <CodeMirror
                className="editor"
                height='100%'
                style={{"maxHeight": tabKey === "instructor" ? "192px" : "295px"}}
                value={createTableStatement}
                extensions={[sql({}), EditorView.lineWrapping]}
                onChange={(value, viewUpdate) => {
                  console.log('value:', value);
                  setCreateTableStatement(value);
                }}
              />
              {
                tabKey === 'instructor' &&
                <CodeMirror
                  className="editor"
                  style={{"maxHeight": "192px"}}
                  height='100%'
                  value={taSubmission}
                  extensions={[sql({}), EditorView.lineWrapping]}
                  onChange={(value, viewUpdate) => {
                    console.log('value:', value);
                    setTaSubmission(value);
                  }}
                />
              }
              <CodeMirror
                className="editor"
                height='100%'
                style={{"maxHeight": tabKey === "instructor" ? "192px" : "295px"}}
                value={studentSubmission}
                extensions={[sql({}), EditorView.lineWrapping]}
                onChange={(value, viewUpdate) => {
                  console.log('value:', value);
                  setStudentSubmission(value);
                }}
              />
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