import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import {Badge, Form} from "react-bootstrap";
import Placeholder from "react-bootstrap/Placeholder";

function RecipeDetail() {
    const [recipeLoadCall, setRecipeLoadCall] = useState({
        state: "pending",
    });

    const [ingredientsLoadCall, setIngredientsLoadCall] = useState({
        state: "pending",
    });

    const [ingredientsPortionModifier, setIngredientsPortionModifier] = useState(1);


    let [searchParams] = useSearchParams();

    const recipeId = searchParams.get("id");

    let navigate = useNavigate();

    useEffect(() => {
        setRecipeLoadCall({
            state: "pending",
        });
        fetch(`http://localhost:3000/recipe/get?id=${recipeId}`, {
            method: "GET",
        }).then(async (response) => {
            const responseJson = await response.json();
            if (response.status >= 400) {
                setRecipeLoadCall({state: "error", error: responseJson});
            } else {
                setRecipeLoadCall({state: "success", data: responseJson});
            }
        });
    }, [recipeId]);

    useEffect(() => {
        if (recipeLoadCall.state === "success") {
            fetch(`http://localhost:3000/ingredient/list`, {
                method: "GET",
            }).then(async (response) => {
                const responseJson = await response.json();
                if (response.status >= 400) {
                    setIngredientsLoadCall({state: "error", error: responseJson});
                } else {
                    setIngredientsLoadCall({state: "success", data: responseJson});
                }
            });
        }

    }, [])

    function getInredients() {
        switch (ingredientsLoadCall.state) {
            case "success":
                return (
                    <Container className="d-flex px-0">
                        {recipeLoadCall.data.ingredients.map((ingredient, index) => {
                                const ingredientNameUnit = ingredientsLoadCall.data.filter((allIngredient) => {
                                    return ingredient.id === allIngredient.id
                                })
                                return (
                                    <Badge pill bg="danger" className="py-2 px-3 m-1 fs-6 fw-normal" key={index}>
                                        {ingredientNameUnit[0].name} <span
                                        className="fw-bold">{ingredient.amount * ingredientsPortionModifier}</span> {ingredientNameUnit[0].unit}
                                    </Badge>
                                )
                            }
                        )}
                    </Container>
                )

        }
    }

    function handleChangePortions(e) {
        setIngredientsPortionModifier(e.target.value);
    }

    function getRecipe() {
        switch (recipeLoadCall.state) {
            case "pending":
                return (
                    <Container className='w-50'>

                        <Card>
                            <Card.Body>
                                <Placeholder as={Card.Title} animation="glow" className="text-center fs-2">
                                    <Placeholder xs={6}/>
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow">
                                    <Placeholder xs={7}/>
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow" className="fs-3">
                                    <Placeholder xs={2}/>
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow">
                                    <Placeholder xs={7}/>
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow" className="fs-3">
                                    <Placeholder xs={2}/>
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow" className="fs-4">
                                    <Placeholder md={2} bg="danger"/> {' '}
                                    <Placeholder md={2} bg="danger"/> {' '}
                                    <Placeholder md={2} bg="danger"/>
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow" className="fs-6">
                                    <Placeholder xs={2}/>
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow" className="fs-3">
                                    <Placeholder md={2}/>
                                </Placeholder>
                            </Card.Body>
                            <Card.Footer className=""><Placeholder.Button variant="primary" xs={1}/></Card.Footer>
                        </Card>
                    </Container>
                );
            case "success":
                return (
                    <Container className="w-50">
                        <Card>
                            {/*<Card.Header>Featured</Card.Header>*/}
                            <Card.Body>
                                <Card.Title className="text-center"><h2>{recipeLoadCall.data.name}</h2></Card.Title>
                                <Card.Text>
                                    {recipeLoadCall.data.description}
                                </Card.Text>

                                <h3>Postup</h3>
                                <Card.Text>
                                    {recipeLoadCall.data.procedure}
                                </Card.Text>

                                <h3>Ingredience</h3>
                                {getInredients()}

                                <Form onSubmit={(e) => e.preventDefault()} className="col-2 mt-2">
                                    <Form.Group>
                                        <Form.Label>Počet osob</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="amount"
                                            defaultValue={1}
                                            onChange={(e) => handleChangePortions(e)}
                                            min={1}
                                            required

                                        />

                                    </Form.Group>
                                </Form>
                            </Card.Body>
                            <Card.Footer className=""><Button variant="primary" onClick={() => navigate("/")}>Zpět na
                                recepty</Button></Card.Footer>
                        </Card>
                    </Container>
                );
            case "error":
                return (
                    <div>
                        <div>Nepodařilo se načíst data receptu.</div>
                        <br/>
                        <pre>{JSON.stringify(recipeLoadCall.error, null, 2)}</pre>
                    </div>
                );
            default:
                return null;
        }
    }

    return getRecipe();
}

export default RecipeDetail;
