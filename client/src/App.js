import {Outlet, useNavigate} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {useContext} from "react";
import UserContext from "./UserProvider";

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
                        Simple School
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`}/>
                    <Navbar.Offcanvas id={`offcanvasNavbar-expand-sm`}>
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                                Simple School
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
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
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
            <Outlet/>
        </div>
    );
}

export default App;
