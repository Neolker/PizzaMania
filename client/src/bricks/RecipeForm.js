import Icon from '@mdi/react';
import {mdiLoading} from '@mdi/js';
import {useEffect, useState} from "react";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";

export default function RecipeForm({recipe, show, setAddGradeShow, onComplete}) {
    const defaultForm = {
        id: "",
        name: "",
        description: "",
        procedure: "",
        ingredients: {
            name: "Cesto",
            amount: 0,
            unit: "g"
        },
    };
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState(defaultForm);
    const [studentAddGradeCall, setStudentAddGradeCall] = useState({
        state: 'inactive'
    });

    useEffect(() => {
        if (recipe) {
            setFormData({
                id: recipe.id,
                name: recipe.name,
                description: recipe.description,
                procedure: recipe.procedure,
                ingredients: {
                    name: recipe.ingredients[0].name,
                    amount: recipe.ingredients[0].amount,
                    unit: recipe.ingredients[0].unit
                },
            });
        } else {
            setFormData(defaultForm);
        }
    }, [recipe]);

    const handleClose = () => {
        setAddGradeShow({state: false});
        setFormData(defaultForm);
    };

    const setField = (name, val) => {
        return setFormData((formData) => {
            const newData = {...formData};
            newData[name] = val;
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        const form = e.currentTarget;

        e.preventDefault();
        e.stopPropagation();

        const payload = {
            ...formData
        };

        if (!form.checkValidity()) {
            setValidated(true);
            return;
        }

        setStudentAddGradeCall({state: 'pending'});
        const res = await fetch(`http://localhost:3000/recipe/${recipe ? 'update' : 'create'}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.status >= 400) {
            setStudentAddGradeCall({state: "error", error: data});
        } else {
            setStudentAddGradeCall({state: "success", data});

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
                        <Modal.Title>{recipe ? 'Upravit' : 'Přidat'} recept</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control
                            type="text"
                            value={formData.id}
                            aria-label="Disabled input example"
                            disabled
                            hidden
                        />
                        <Form.Group className="mb-3">
                            <Form.Label>Název</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setField("name", e.target.value)}
                                maxLength={20}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Popis</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={formData.description}
                                onChange={(e) => setField("description", e.target.value)}
                                maxLength={20}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Zadejte popis s maximální délkou 20 znaků
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Postup</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={formData.procedure}
                                onChange={(e) => setField("procedure", e.target.value)}
                                maxLength={20}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Zadejte popis s maximální délkou 20 znaků
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Label>Ingredience</Form.Label>
                        <Row>

                            <Form.Group as={Col} className="mb-3">
                                <Form.Label>Název</Form.Label>
                                <Form.Select
                                    value={formData.ingredients.name}
                                    onChange={(e) => setField("name", Number(e.target.value))}
                                    required
                                >
                                    <option value="" disabled>
                                        Váha známky
                                    </option>
                                    <option value={'Syr'}>Syr</option>
                                    <option value={'Cesto'}>Cesto</option>
                                    <option value={'Kukurice'}>Kukurice</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} className="mb-3">
                                <Form.Label>Číslo</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.ingredients.amount}
                                    onChange={(e) => setField("amount", parseInt(e.target.value))}
                                    min={3}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Zadejte známku 1-5
                                </Form.Control.Feedback>
                            </Form.Group>


                            <Form.Group as={Col} className="mb-3">
                                <Form.Label>Jednotka</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.ingredients.unit}
                                    onChange={(e) => setField("unit", e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Vyberte platný datum
                                </Form.Control.Feedback>
                            </Form.Group>

                        </Row>
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
                                <Button variant="primary" type="submit"
                                        disabled={studentAddGradeCall.state === 'pending'}>
                                    {studentAddGradeCall.state === 'pending' ? (
                                        <Icon size={0.8} path={mdiLoading} spin={true}/>
                                    ) : (
                                        recipe ? 'Upravit' : 'Přidat'
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
