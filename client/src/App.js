import {Outlet, useNavigate} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {useContext} from "react";
import UserContext from "./UserProvider";
import logo from "./logo_pizzamania.png"

function App() {

    const {user, users, changeUser} = useContext(UserContext);

    let navigate = useNavigate();

    return (
        <div className="App">
            <Navbar
                fixed="top"
                expand={"sm"}
                className="mb-3"
                bg="dark"
                variant="dark"
            >
                <Container fluid>
                    <Navbar.Brand onClick={() => navigate("/")}>
                        <img
                            alt="PizzaMania"
                            src={logo}
                            width="64"
                            height="32"
                            className="d-inline-block align-top"
                        />{' '}
                        PizzaMania
                    </Navbar.Brand>
                    <Button variant="success">Přidat recept</Button>
                    <Button variant="success">Přidat ingredienci</Button>
                    <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <NavDropdown align="end" title={user.fullName ?? 'Nepřihlášen'}>
                            {users.map(user => {
                                return (
                                    <NavDropdown.Item onClick={() => changeUser(user.id)}>
                                        {user.fullName} ({user.role.name})
                                    </NavDropdown.Item>
                                )
                            })}
                            <NavDropdown.Item onClick={() => changeUser(-1)}>
                                Odhlásit se
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
            <Outlet/>
        </div>
    );
}

export default App;
