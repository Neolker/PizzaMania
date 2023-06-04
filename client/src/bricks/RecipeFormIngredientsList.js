import {Button, Col, Form, Row} from "react-bootstrap";
import {useEffect, useState} from "react";


export default function RecipeFormIngredientsList({formData, setFormData, setField, onComplete}) {

    const [listIngredientsCall, setListIngredientsCall] = useState({
        state: "pending",
    });
    const [formDataIngredients, setFormDataIngredients] = useState(formData.ingredients);


    useEffect(() => {

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

        setFormDataIngredients(formData.ingredients)


    }, [formData]);


    const handleChangeIngredient = (e, index) => {
        setField(e, index);

        let newDataFormIngredients = formDataIngredients;
        newDataFormIngredients[index][e.target.name] = e.target.value;
        setFormDataIngredients(newDataFormIngredients);


    }

    const displayIngredientUnit = (id) => {
        if (id) {
            return (listIngredientsCall.state === "success" &&
                listIngredientsCall.data.filter((allIngredient) => {
                    return allIngredient.id === id
                })[0].unit)
        } else {
            return listIngredientsCall.state === "success" && listIngredientsCall.data[0].unit
        }

    }


    const addIngredient = () => {
        let newDataForm = formData;
        newDataForm.ingredients = [...formData.ingredients, {id: "", amount: 0}];
        setFormData(newDataForm);

        setFormDataIngredients(newDataForm.ingredients);

    }

    const removeIngredient = (index) => {
        let newDataForm = formData;
        newDataForm.ingredients.splice(index, 1);
        setFormData(newDataForm);

        setFormDataIngredients([...newDataForm.ingredients]);
    }

    const handleClose = () => {
        setFormDataIngredients(formData.ingredients)
    };


    return (
        <>
            <Form.Label>Ingredience</Form.Label>

            {formDataIngredients.map((ingredient, index) =>

                <Row key={index}  className="bg-black rounded py-3 px-2 mx-1 mb-2">
                    <Col className="col-1 d-flex justify-content-start align-items-center">
                        #{index+1}
                    </Col>
                    <Form.Group className="col-5 col-lg-6">
                        <Form.Label>Název</Form.Label>
                        <Form.Select
                            name="id"
                            value={ingredient.id}
                            onChange={(e) => handleChangeIngredient(e, index)}
                            minLength={2}
                            maxLength={64}
                            required
                        >
                            <option value=""> </option>
                            {listIngredientsCall.state === "success" &&
                                listIngredientsCall.data.map((allIngredient, index) =>
                                    <option value={allIngredient.id} key={index}>{allIngredient.name}</option>
                                )
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid" className="fw-bold">
                            Vyberte ingredienci
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className=" col-3 col-lg-2 px-2">
                        <Form.Label>Množství</Form.Label>
                        <Form.Control
                            type="number"
                            name="amount"
                            value={ingredient.amount}
                            onChange={(e) => setField(e, index)}
                            min={1}
                            required

                        />
                        <Form.Control.Feedback type="invalid" className="fw-bold">
                            Zadejte množství
                        </Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group className="col-2 col-lg-2 px-0  d-flex justify-content-start align-items-end">
                        <Form.Label></Form.Label>
                        <Form.Control
                            type="text"
                            name="unit"
                            value={displayIngredientUnit(ingredient.id)}
                            readOnly
                            plaintext
                            required
                            minLength={1}
                            className="fw-bold"
                        />
                        <Form.Control.Feedback type="invalid" className="fw-bold">
                            Vyberte platnú jednotku
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="col-1 d-flex justify-content-end align-items-end">
                        <Button variant="danger" onClick={() => removeIngredient(index)}><i className="bi bi-trash-fill"></i></Button>
                    </Form.Group>

                </Row>
            )}
            <Row className="justify-content-sm-center">
                <Button onClick={() => addIngredient()} className="col-5 " ><i className="bi bi-plus-lg"></i> Přidat ingredienci</Button>
            </Row>

        </>
    );
}