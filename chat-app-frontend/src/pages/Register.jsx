import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const authContext = useContext(AuthContext);
  return (
    <>
      <Form onSubmit={authContext.registerUser}>
        <Row style={{
          height: "100vh",
          justifyContent: "center",
          paddingTop: "10px",
        }}>
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Sign up a new account</h2>
              <Form.Control
                type="text"
                placeholder="Name"
                onChange={(e) => authContext.updateRegisterInfo({
                  ...authContext.registerInfo,
                  name: e.target.value
                })}
              />
              <Form.Control
                type="text"
                placeholder="Email"
                onChange={(e) => authContext.updateRegisterInfo({
                  ...authContext.registerInfo,
                  email: e.target.value
                })}
              />
              <Form.Control
                type="text"
                placeholder="Password"
                onChange={(e) => authContext.updateRegisterInfo({
                  ...authContext.registerInfo,
                  password: e.target.value
                })}
              />
              <Button variant="primary" type="submit">
                {authContext.isLoading ? "Wait a second!!" : "Sign up"}
              </Button>

              <Alert variant="danger">
                <p> ༼ つ⇧ ◕_◕ ༽つ⇧ --- {authContext.actionError?.message || "Hello!"}</p>
              </Alert>
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default Register;