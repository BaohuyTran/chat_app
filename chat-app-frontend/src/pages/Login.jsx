import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";

const Login = () => {
  return (
    <>
      <Form>
        <Row style={{
          height: "100vh",
          justifyContent: "center",
          paddingTop: "10px",
        }}>
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Welcome back!</h2>
              <Form.Control type="text" placeholder="Email" />
              <Form.Control type="text" placeholder="Password" />
              <Button variant="primary" type="submit">
                Log in
              </Button>
              <Alert variant="danger">
                <p>An error has occurred! ༼ つ⇧ ◕_◕ ༽つ⇧</p>
              </Alert>
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default Login;