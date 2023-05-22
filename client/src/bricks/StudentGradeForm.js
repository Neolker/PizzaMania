import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

export default function StudentGradeForm({ student, subject, classroom, show, setAddGradeShow, grade, onComplete }) {
  const defaultForm = {
    description: "",
    dateTs: new Date().toISOString().substring(0, 10),
    grade: null,
    weight: 1,
  };
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [studentAddGradeCall, setStudentAddGradeCall] = useState({
    state: 'inactive'
  });

  useEffect(() => {
    if (grade) {
      setFormData({
        description: grade.description,
        dateTs: new Date(grade.dateTs).toISOString().substring(0, 10),
        grade: grade.grade,
        weight: grade.weight
      });
    } else {
      setFormData(defaultForm);
    }
  }, [grade]);

  const handleClose = () => {
    setAddGradeShow({ state: false });
    setFormData(defaultForm);
  };

  const setField = (name, val) => {
    return setFormData((formData) => {
      const newData = { ...formData };
      newData[name] = val;
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    const form = e.currentTarget;

    e.preventDefault();
    e.stopPropagation();

    const payload = {
      ...formData,
      studentId: student.id,
      subjectId: subject.id,
      id: grade ? grade.id : null
    };

    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    setStudentAddGradeCall({ state: 'pending' });
    const res = await fetch(`http://localhost:3000/grade/${grade ? 'update' : 'create'}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.status >= 400) {
      setStudentAddGradeCall({ state: "error", error: data });
    } else {
      setStudentAddGradeCall({ state: "success", data });

      if (typeof onComplete === 'function') {
        onComplete(data);
      }

      handleClose();
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
          <Modal.Header closeButton>
            <Modal.Title>{grade ? 'Upravit' : 'Přidat'} známku</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Žák: {student.firstname + " " + student.surname}</div>
            <div>Předmět: {subject.name}</div>
            <div>Třída: {classroom.name}</div>
            <br />
            <Form.Group className="mb-3">
              <Form.Label>Popis</Form.Label>
              <Form.Control
                type="text"
                value={formData.description}
                onChange={(e) => setField("description", e.target.value)}
                maxLength={20}
                required
              />
              <Form.Control.Feedback type="invalid">
                Zadejte popis s maximální délkou 20 znaků
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Form.Group as={Col} className="mb-3">
                <Form.Label>Známka</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="1-5"
                  value={formData.grade}
                  onChange={(e) => setField("grade", parseInt(e.target.value))}
                  min={1}
                  max={5}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Zadejte známku 1-5
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} className="mb-3">
                <Form.Label>Váha</Form.Label>
                <Form.Select
                  value={formData.weight}
                  onChange={(e) => setField("weight", Number(e.target.value))}
                  required
                >
                  <option value="" disabled>
                    Váha známky
                  </option>
                  <option value={0.5}>0.5</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </Form.Select>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Datum</Form.Label>
              <Form.Control
                type="date"
                value={formData.dateTs}
                onChange={(e) => setField("dateTs", e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Vyberte platný datum
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex flex-row justify-content-between align-items-center w-100">
              <div>
                {studentAddGradeCall.state === 'error' &&
                  <div className="text-danger">Error: {studentAddGradeCall.error.errorMessage}</div>
                }
              </div>
              <div className="d-flex flex-row gap-2">
                <Button variant="secondary" onClick={handleClose}>
                  Zavřít
                </Button>
                <Button variant="primary" type="submit" disabled={studentAddGradeCall.state === 'pending'}>
                  {studentAddGradeCall.state === 'pending' ? (
                    <Icon size={0.8} path={mdiLoading} spin={true} />
                  ) : (
                    grade ? 'Upravit' : 'Přidat'
                  )}
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
