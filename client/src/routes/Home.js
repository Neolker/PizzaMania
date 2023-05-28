import {useContext, useEffect, useState} from "react";
import UserContext from "../UserProvider";
import {useNavigate} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiAlertOctagonOutline} from "@mdi/js";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import Stack from 'react-bootstrap/Stack';
import NavDropdown from "react-bootstrap/NavDropdown";

function Home() {

    const [listRecipeCall, setListRecipeCall] = useState({
        state: "pending",
    });
    const {user, users, changeUser, getClassroomsToShow, isLoggedIn} = useContext(UserContext);

    let navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/recipe/list`, {
            method: "GET",
        }).then(async (response) => {
            const responseJson = await response.json();
            if (response.status >= 400) {
                setListRecipeCall({state: "error", error: responseJson});
            } else {
                setListRecipeCall({state: "success", data: responseJson});
            }
        });
    }, []);

    function getRecipeList() {
        switch (listRecipeCall.state) {
            case "pending":
                return (<Stack direction="horizontal" gap={3}>
                    <Card style={{width: '18rem'}}>
                        <Card.Img variant="top" src="holder.js/100px180"/>
                        <Card.Body>
                            <Placeholder as={Card.Title} animation="glow">
                                <Placeholder xs={6}/>
                            </Placeholder>
                            <Placeholder as={Card.Text} animation="glow">
                                <Placeholder xs={7}/> <Placeholder xs={4}/> <Placeholder xs={4}/>{' '}
                                <Placeholder xs={6}/> <Placeholder xs={8}/>
                            </Placeholder>
                            <Placeholder.Button variant="primary" xs={6}/>
                        </Card.Body>
                    </Card>
                    <Card style={{width: '18rem'}}>
                        <Card.Img variant="top" src="holder.js/100px180"/>
                        <Card.Body>
                            <Placeholder as={Card.Title} animation="glow">
                                <Placeholder xs={6}/>
                            </Placeholder>
                            <Placeholder as={Card.Text} animation="glow">
                                <Placeholder xs={7}/> <Placeholder xs={4}/> <Placeholder xs={4}/>{' '}
                                <Placeholder xs={6}/> <Placeholder xs={8}/>
                            </Placeholder>
                            <Placeholder.Button variant="primary" xs={6}/>
                        </Card.Body>
                    </Card>
                    <Card style={{width: '18rem'}}>
                        <Card.Img variant="top" src="holder.js/100px180"/>
                        <Card.Body>
                            <Placeholder as={Card.Title} animation="glow">
                                <Placeholder xs={6}/>
                            </Placeholder>
                            <Placeholder as={Card.Text} animation="glow">
                                <Placeholder xs={7}/> <Placeholder xs={4}/> <Placeholder xs={4}/>{' '}
                                <Placeholder xs={6}/> <Placeholder xs={8}/>
                            </Placeholder>
                            <Placeholder.Button variant="primary" xs={6}/>
                        </Card.Body>
                    </Card>
                </Stack>);
            case "success":
                return (<Stack direction="horizontal" gap={3}>
                    {listRecipeCall.data.map((recipe) => {

                        return (
                            <Card style={{width: '18rem'}}>
                                <Card.Img variant="top" src=""/>
                                <Card.Body>
                                    <Card.Title>
                                        {recipe.name}
                                    </Card.Title>
                                    <Card.Text>
                                        {recipe.description}
                                    </Card.Text>
                                    <Button variant="primary"
                                            onClick={() => navigate("/recipeDetail?id=" + recipe.id)}
                                    >Read more</Button>
                                    {/*{users.map(user => {*/}
                                    {/*    return (*/}
                                    {/*        <NavDropdown.Item onClick={() => changeUser(user.id)}>*/}
                                    {/*            {user.fullName} ({user.role.name})*/}
                                    {/*        </NavDropdown.Item>*/}
                                    {/*    )*/}
                                    {/*})}*/}
                                    {/*{*/}
                                    {  (getClassroomsToShow(listRecipeCall.data).includes(recipe.id)) ? <Button variant="secondary">Edit</Button> : ""
                                    }
                                </Card.Body>
                            </Card>);
                    })}
                </Stack>)
            case "error":
                return (<div>
                    <Icon size={1} path={mdiAlertOctagonOutline}/> Error
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
