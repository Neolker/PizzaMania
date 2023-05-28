import { useContext, useEffect, useState } from "react";
import UserContext from "../UserProvider";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiAlertOctagonOutline } from "@mdi/js";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import Stack from 'react-bootstrap/Stack';
import NavDropdown from "react-bootstrap/NavDropdown";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import RecipeDelete from "../bricks/RecipeDelete";

function Home() {

    const [listRecipeCall, setListRecipeCall] = useState({
        state: "pending",
    });
    const { user, users, changeUser, isEditor, isAdmin, isLoggedIn } = useContext(UserContext);

    let navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/recipe/list`, {
            method: "GET",
        }).then(async (response) => {
            const responseJson = await response.json();
            if (response.status >= 400) {
                setListRecipeCall({ state: "error", error: responseJson });
            } else {
                setListRecipeCall({ state: "success", data: responseJson });
            }
        });
    }, []);

    function getRecipeList() {
        switch (listRecipeCall.state) {
            case "pending":
                return (<Stack direction="horizontal" gap={3}>
                    <Card style={{ width: '18rem' }}>
                        //TODO IMAGE
                        <Card.Body>
                            <Placeholder as={Card.Title} animation="glow">
                                <Placeholder xs={6} />
                            </Placeholder>
                            <Placeholder as={Card.Text} animation="glow">
                                <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                                <Placeholder xs={6} /> <Placeholder xs={8} />
                            </Placeholder>
                            <Placeholder.Button variant="primary" xs={6} />
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }}>
                        //TODO IMAGE
                        <Card.Body>
                            <Placeholder as={Card.Title} animation="glow">
                                <Placeholder xs={6} />
                            </Placeholder>
                            <Placeholder as={Card.Text} animation="glow">
                                <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                                <Placeholder xs={6} /> <Placeholder xs={8} />
                            </Placeholder>
                            <Placeholder.Button variant="primary" xs={6} />
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }}>
                        //TODO IMAGE
                        <Card.Body>
                            <Placeholder as={Card.Title} animation="glow">
                                <Placeholder xs={6} />
                            </Placeholder>
                            <Placeholder as={Card.Text} animation="glow">
                                <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                                <Placeholder xs={6} /> <Placeholder xs={8} />
                            </Placeholder>
                            <Placeholder.Button variant="primary" xs={6} />
                        </Card.Body>
                    </Card>
                </Stack>);
            case "success":
                return (<Row>
                    {listRecipeCall.data.map((recipe) => {

                        return (
                            <Col>
                            <Card style={{ width: '18rem' }}>
                                //TODO IMAGE
                                <Card.Body>
                                    <Card.Title>
                                        {recipe.name}
                                    </Card.Title>
                                    <Card.Text>
                                        {recipe.description}
                                    </Card.Text>
                                    <Button variant="primary"
                                        onClick={() => navigate("/recipeDetail?id=" + recipe.id)}
                                    >Otevřít</Button>
                                    {
                                        ( isEditor() || isAdmin() ) ? <Button variant="secondary">Upravit</Button> : ""
                                    }
                                    {
                                        ( isAdmin() ) ? <Button variant="danger">Smazat</Button> : ""
                                    }
                                    <RecipeDelete recipe={recipe}></RecipeDelete>
                                </Card.Body>
                            </Card>
                            </Col>);
                    })}
                </Row>)
            case "error":
                return (<div>
                    <Icon size={1} path={mdiAlertOctagonOutline} /> Error
                </div>);
            default:
                return null;
        }
    }

    return (<Container>
        {getRecipeList()}
    </Container>);
}

export default Home;
