import { Container, Row, Col, Stack, Button, ListGroup, Modal, Form } from 'react-bootstrap';
import CodeMirror, { placeholder } from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { EditorView } from "@codemirror/view";
import { useState } from 'react';

import "./styles/TmplManage.css"
import templates from '../utils/data/templates';

function TmplManage(props) {

  const [tmplKey, setTmplKey] = useState(-1);
  const [tmpl, setTmpl] = useState(templates);
  const [createTableStatement, setCreateTableStatement] = useState("");
  const [taSubmission, setTaSubmission] = useState("");

  const [show, setShow] = useState(false);
  const [newTmplName, setNewTmplName] = useState("");

  const selectTmpl = e => {
    const i = e.target.getAttribute('index')
    setTmplKey(i);
    setCreateTableStatement(tmpl[i].createTableStatement);
    setTaSubmission(tmpl[i].taSubmission);
  }

  const handleCreateTmpl = e => {
    e.preventDefault();
    setShow(false);
    setTmpl([...tmpl, {
      "name": newTmplName,
      "createTableStatement": "",
      "taSubmission": "",
    }]);
    setNewTmplName("");
  }

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} size="md" centered >
        <Modal.Header closeButton>
          <Modal.Title>New Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateTmpl}>
            <Form.Group controlId="formName">
              <Form.Control
                type="text"
                placeholder="Enter template name"
                onChange={e => setNewTmplName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateTmpl}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Container className="tmpl-container">
        <Row>
          <Col>
            <Button variant="outline-primary" onClick={() => setShow(true)} >
              Create
            </Button>
          </Col>
          <Col className='btn-row'>
            <Stack direction='horizontal' gap={3}>
              <Button variant="outline-success" disabled={tmplKey === -1}>
                Save
              </Button>
              <Button variant="outline-danger" disabled={tmplKey === -1}>
                Delete
              </Button>
            </Stack>
          </Col>
        </Row>

        <Row>
          <Col className="tmpl-list">
            <ListGroup numbered as="ol">
              <ListGroup.Item
                action
                onClick={() => { setTmplKey(-1); setCreateTableStatement(""); setTaSubmission(""); }}
                eventKey={-1}
                active={false}
              >
                <div className="fw-bold">Templates</div>
              </ListGroup.Item>
              {tmpl.map((t, i) =>
                <ListGroup.Item action onClick={selectTmpl} index={i} eventKey={i} key={i} as="li">
                  {t.name}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Col>
          <Col className="editor-area">
            <CodeMirror
              className="editor"
              height='100%'
              style={{ "maxHeight": "295px" }}
              value={createTableStatement}
              extensions={[sql({}), placeholder("Click a template to view the table schema..."), EditorView.lineWrapping]}
              onChange={(value, viewUpdate) => {
                console.log('value:', value);
                setCreateTableStatement(value);
              }}
              editable={tmplKey !== -1}
            />
            <CodeMirror
              className="editor"
              height='100%'
              style={{ "maxHeight": "295px" }}
              value={taSubmission}
              extensions={[sql({}), placeholder("Click a template to view the staff solution..."), EditorView.lineWrapping]}
              onChange={(value, viewUpdate) => {
                console.log('value:', value);
                setTaSubmission(value);
              }}
              editable={tmplKey !== -1}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TmplManage;