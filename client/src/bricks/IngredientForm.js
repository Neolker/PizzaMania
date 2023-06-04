import Icon from '@mdi/react';
import {mdiLoading} from '@mdi/js';
import {useEffect, useState} from "react";
import {Button, Col, Form, Modal, Row, Table} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import Container from "react-bootstrap/Container";

export default function IngredientForm({show, setAddIngredientShow: setAddIngredientShow, onComplete}) {
    const defaultForm = {
        id: "",
        amount: 0
    };

    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState(defaultForm);
    const [addIngredientCall, setAddIngredientCall] = useState({
        state: 'inactive'
    });

    const [listIngredientsCall, setListIngredientsCall] = useState({
        state: "pending",
    });

    useEffect(() => {
        setListIngredientsCall({state: "pending"});


        fetch(`http://localhost:3000/ingredient/list`, {
            method: "GET",
        }).then(async (response) => {
            const responseJson = await response.json();
            if (response.status >= 400) {
                setListIngredientsCall({state: "error", error: responseJson});
            } else {
                setListIngredientsCall({state: "success", data: responseJson});

            }
        });


    }, [addIngredientCall]);


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

        setAddIngredientCall({state: 'pending'});
        const res = await fetch(`http://localhost:3000/ingredient/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });


        const data = await res.json();

        if (res.status >= 400) {
            setAddIngredientCall({state: "error", error: data});
        } else {
            setAddIngredientCall({state: "success", data});

            if (typeof onComplete === 'function') {
                onComplete(data);
            }

            handleClose();
        }
    };

    function getIngredientsList() {
        switch (listIngredientsCall.state) {
            case "pending":
                return (
                    <Table striped>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Název</th>
                            <th>Jednotka</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            [...Array(6)].map((e, innerIndex) =>
                                <tr>
                                    <td><Placeholder as={Card.Text} animation="glow" className="fs-3">
                                        <Placeholder lg={6}/>{' '}
                                    </Placeholder></td>
                                    <td><Placeholder as={Card.Text} animation="glow" className="fs-3">
                                        <Placeholder lg={6}/>{' '}
                                    </Placeholder></td>
                                    <td><Placeholder as={Card.Text} animation="glow" className="fs-3">
                                        <Placeholder lg={6}/>{' '}
                                    </Placeholder></td>
                                </tr>

                            )
                        }
                        </tbody>
                    </Table>
                )

            case "success":
                return (
                    <Table striped>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Název</th>
                            <th>Jednotka</th>
                        </tr>
                        </thead>
                        <tbody>
                        {listIngredientsCall.state === "success" && listIngredientsCall.data.map((ingredient, index) =>
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{ingredient.name}</td>
                                <td>{ingredient.unit}</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>)

        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Přidat recept</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {getIngredientsList()}
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
                                <Form.Control.Feedback type="invalid" className="fw-bold">
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
                                <Form.Control.Feedback type="invalid" className="fw-bold">
                                    Zadejte jednotku s minimální délkou 1 znak
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-flex flex-row justify-content-between align-items-center w-100">
                            <div>
                                {addIngredientCall.state === 'error' &&
                                    <div
                                        className="text-danger">Error: {addIngredientCall.error.errorMessage}</div>
                                }
                            </div>
                            <div className="d-flex flex-row gap-2">
                                <Button variant="dark" onClick={handleClose}>
                                    Zavřít
                                </Button>
                                <Button variant="success" type="submit"
                                        disabled={addIngredientCall.state === 'pending'}>
                                    {addIngredientCall.state === 'pending' ? (
                                        <Icon size={0.8} path={mdiLoading} spin={true}/>
                                    ) : (
                                        "Přidat"
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
