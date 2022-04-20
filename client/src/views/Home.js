import { Container, Row, Col, Dropdown, Stack, Spinner, Table, Tab, Tabs } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
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
  const [resultTables, setResultTables] = useState([]);

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
    setResultTables([]);
    const result = await axios.post('http://localhost:5000/check', {
      // schema: "CREATE TABLE indiv_sample_nyc(\n cmte_id INT,\n transaction_amt INT,\n name VARCHAR(10),\n str_name VARCHAR(10)\n );",
      schema: createTableStatement,
      ta_input: taSubmission,
      student_input: studentSubmission
    });
    console.log(result);
    let { status, test_log } = result.data;
    test_log = test_log.replaceAll("<", "&lt").replaceAll(">", "&gt").replace(/\n/g, "<br />");
    setResultStatus(status);
    if (test_log.indexOf("Table") !== -1) {
      // "(Table \"INDIV_SAMPLE_NYC\" '(\"CMTE_ID\" \"TRANSACTION_AMT\" \"NAME\" \"STR_NAME\") '(((1 0 \"0\" \"0\") . 1)))↵"
      const tablesTestLogs = test_log.split("<br />");
      const generatedTables = [];
      for (const tablesTestLog of tablesTestLogs) {
        if (tablesTestLog.length <= 0) continue;
        const resultTable = { cols: "", rows: "" };
        const tblName = tablesTestLog.substring(tablesTestLog.indexOf("Table")+7, tablesTestLog.indexOf("\"", tablesTestLog.indexOf("Table \"") + 7));
        // Find all cols
        const colNames = tablesTestLog.substring(tablesTestLog.indexOf("(", 1)+1, tablesTestLog.indexOf(")", 1)).replaceAll("\"", "").split(" ");
        let tblCols = "<th>#</th>";
        for (let name of colNames) tblCols += "<th>" + name + "</th>";
        resultTable["cols"] = tblCols;
        // Find all records
        if (tablesTestLog.indexOf("(((") !== -1) {
          const recordsPerRow = tablesTestLog.substring(tablesTestLog.indexOf("(((")+3, tablesTestLog.indexOf(")", tablesTestLog.indexOf("((("))).split(" ");
          const recordNumPerRow = test_log.substring(test_log.indexOf(".", test_log.indexOf("((("))+2, test_log.indexOf(")))"));
          // TODO: Modify code if there're multiple different kinds of record
          for (let i=0; i<recordNumPerRow; i++) {
            let tblHtml = "<tr><td>" + i + "</td>";
            for (let record of recordsPerRow) tblHtml += "<td>" + record + "</td>";
            tblHtml += "</tr>";
            resultTable["rows"] = tblHtml;
          }
        }
        generatedTables.push(resultTable);
      }
      setResultTables(generatedTables);
    } else {
      setResultLog(test_log);
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
            
              <Button variant="outline-primary">
                Upload
              </Button>
            
              <Button variant="link" onClick={() => navigate("/manage-templates")} >
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
            <div className="editor-area">
              <CodeMirror
                className="editor"
                height='100%'
                style={{"maxHeight": tabKey === "instructor" ? "192px" : "295px"}}
                value={createTableStatement}
                extensions={[sql({})]}
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
                  extensions={[sql({})]}
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
                extensions={[sql({})]}
                onChange={(value, viewUpdate) => {
                  console.log('value:', value);
                  setStudentSubmission(value);
                }}
              />
            </div>
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
              { (resultStatus === "ERROR") && <Button variant="danger" active>Error</Button> }
              { (resultStatus === "Undecidable") && <Button variant="secondary" active>Not Decidable</Button> }
              <br></br>
              <br></br>
              { (resultTables.length > 0  && <p>The following table is the counterexample</p>)}
              { (resultTables.length > 0  && 
                resultTables.map((item, idx) => {
                  return <Table striped bordered hover key={idx}><thead><tr>{ReactHtmlParser(item.cols)}</tr></thead><tbody>{ReactHtmlParser(item.rows)}</tbody></Table>
                })
                )}
              { (resultTables.length === 0 && ReactHtmlParser(resultLog)) }
            </div>
          </Col>
        </Row>

      </Container>         
    </>
  );
};