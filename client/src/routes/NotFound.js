import {useNavigate} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import {Button} from "react-bootstrap";
function NotFound() {
    let navigate = useNavigate();

    return (
        <Container>
            <Card className="text-center">
                <Card.Header>404 - Page not Found</Card.Header>
                <Card.Body>
                    <Card.Title>OOPS!</Card.Title>
                    <Card.Text>
                        The page you are looking for might have been removed had its name changed or is temporarily unavailable.
                    </Card.Text>
                    <Button variant="primary" onClick={() => navigate("/")}>Go back</Button>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default NotFound;