import {Outlet, useNavigate} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./App.css";
//import "bootstrap/dist/scss/bootstrap.min.scss";
import {useContext} from "react";
import UserContext from "./UserProvider";
import logo from "./logo_pizzamania_new.png";


function App() {

    const {user, users, changeUser} = useContext(UserContext);

    let navigate = useNavigate();

    return (
        <div className="App">
            <Navbar
                expand={"md"}
                className="mb-5 py-sm-3"
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

                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <NavDropdown align="end" title={user.fullName ?? 'Nepřihlášen'}>
                            {users.map((user, index) => {
                                return (
                                    <NavDropdown.Item onClick={() => changeUser(user.id)} key={index}>
                                        {user.fullName}
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
