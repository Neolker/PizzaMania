import Icon from '@mdi/react';
import {mdiLoading} from '@mdi/js';
import {useEffect, useState} from "react";
import {Button, Col, Form, Row, Modal} from "react-bootstrap";
import RecipeFormIngredientsList from "./RecipeFormIngredientsList";

export default function RecipeForm({recipe, show, setAddRecipeShow: setAddRecipeShow, onComplete}) {
    const defaultForm = {
        id: "",
        name: "",
        description: "",
        procedure: "",
        ingredients: [
            {
                id: "",
                amount: 0
            },
            {
                id: "",
                amount: 0
            },
            {
                id: "",
                amount: 0
            }

        ],
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
        setAddRecipeShow({state: false});
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

        if (!form.checkValidity()) {
            setValidated(true);
            return;
        }

        setAddRecipeCall({state: 'pending'});
        const res = await fetch(`http://localhost:3000/recipe/super-${recipe ? 'update' : 'create'}`, {
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
            <Modal show={show} onHide={handleClose} centered size="xl">
                <Form  noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title >{recipe ? 'Upravit' : 'Přidat'} recept</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <Row>
                            <div className="col-xl-6">
                                <Form.Control
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    aria-label="Disabled input example"
                                    disabled
                                    hidden
                                />
                                <Form.Group className="mb-3">
                                    <Form.Label>Název</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={(e) => setField(e)}
                                        minLength={2}
                                        maxLength={64}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid" className="fw-bold">
                                        Zadejte popis s minimální délkou 2 znaků a maximální délkou 64 znaků
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Popis</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        rows={2}
                                        value={formData.description}
                                        onChange={(e) => setField(e)}
                                        minLength={2}
                                        maxLength={160}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid" className="fw-bold">
                                        Zadejte popis s minimální délkou 2 znaků a maximální délkou 160 znaků
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Postup</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="procedure"
                                        rows={5}
                                        value={formData.procedure}
                                        onChange={(e) => setField(e)}
                                        minLength={2}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid" className="fw-bold">
                                        Zadejte popis s minimální délkou 2 znaků
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <div className="col-xl-6">
                                <RecipeFormIngredientsList formData={formData} setFormData={setFormData}
                                                           setField={setField}>

                                </RecipeFormIngredientsList>
                            </div>
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
                                <Button variant="dark" onClick={handleClose}>
                                    Zavřít
                                </Button>
                                <Button variant="success" type="submit"
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
