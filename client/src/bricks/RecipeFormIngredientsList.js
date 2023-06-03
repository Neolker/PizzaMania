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
        newDataForm.ingredients = [...formData.ingredients, { id: "", amount: 0 }];
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


                <Row accessKey={index} onHide={handleClose}>
                    <Form.Group as={Col} className="mb-3">
                        <Form.Label>Název</Form.Label>
                        <Form.Select
                            name="id"
                            value={ingredient.id}
                            onChange={(e) => handleChangeIngredient(e, index)}
                            minLength={2}
                            maxLength={64}
                            required
                        >
                            {listIngredientsCall.state === "success" &&
                                listIngredientsCall.data.map((allIngredient, index) =>
                                    <option value={allIngredient.id} accessKey={index}>{allIngredient.name}</option>
                                )
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Vyberte ingredienci
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3">
                        <Form.Label>Množství</Form.Label>
                        <Form.Control
                            type="number"
                            name="amount"
                            defaultValue={ingredient.amount}
                            onChange={(e) => setField(e, index)}
                            min={1}
                            required

                        />
                        <Form.Control.Feedback type="invalid">
                            Zadejte množství
                        </Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group as={Col} className="mb-3">
                        <Form.Label>Jednotka</Form.Label>
                        <Form.Control
                            type="text"
                            name="unit"
                            value={displayIngredientUnit(ingredient.id)}
                            readOnly
                            required
                            minLength={1}
                            className="fw-bold"
                        />
                        <Form.Control.Feedback type="invalid">
                            Vyberte platnú jednotku
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3">
                        <Button variant="danger" onClick={() => removeIngredient(index)}>Odstranit</Button>
                    </Form.Group>

                </Row>
            )}

            <Button onClick={() => addIngredient()}>Přidat ingredienci</Button>
        </>
    );
}