import Icon from '@mdi/react';
import {mdiLoading} from '@mdi/js';
import {useEffect, useState} from "react";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";

export default function IngredientForm({recipe, show, setAddIngredientShow: setAddIngredientShow, onComplete}) {
    const defaultForm = {
        id: "",
        amount: 0
    };

    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState(defaultForm);
    const [studentAddGradeCall, setAddRecipeCall] = useState({
        state: 'inactive'
    });


    useEffect(() => {
        if (recipe) {
            setFormData(recipe);
        } else {
            setFormData(defaultForm);
        }

    }, [recipe]);


    const handleClose = () => {
        setAddIngredientShow({state: false});
        setFormData(defaultForm);
        setValidated(false)
    };

    const setField = (e, index = undefined) => {
        if (index >= 0) {
            return setFormData((formData) => {
                const newData = {...formData};
                newData.ingredients[index][e.target.name] = e.target.value;
                return newData;
            });
        } else {
            return setFormData((formData) => {
                const newData = {...formData};
                newData[e.target.name] = e.target.value;
                return newData;
            });
        }
    };

    const handleSubmit = async (e) => {
        const form = e.currentTarget;

        e.preventDefault();
        e.stopPropagation();

        const payload = {
            ...formData
        };

        console.log(payload)
        if (!form.checkValidity()) {
            setValidated(true);
            return;
        }

        setAddRecipeCall({state: 'pending'});
        const res = await fetch(`http://localhost:3000/ingredient/${recipe ? 'update' : 'create'}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });


        const data = await res.json();

        if (res.status >= 400) {
            setAddRecipeCall({state: "error", error: data});
        } else {
            setAddRecipeCall({state: "success", data});

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
                        <Row>
                            <Form.Control
                                type="text"
                                name="id"
                                value={formData.id}
                                aria-label="Disabled input example"
                                disabled
                                hidden
                            />
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>Název</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setField(e)}
                                    minLength={2}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Zadejte název s minimální délkou 2 znaků a maximální délkou 160 znaků
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col}>
                                <Form.Label>Jednotka</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={(e) => setField(e)}
                                    minLength={1}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Zadejte jednotku s minimální délkou 1 znak
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
