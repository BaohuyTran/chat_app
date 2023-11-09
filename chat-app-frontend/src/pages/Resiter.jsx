import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { registerInfo, updateRegisterInfo } = useContext(AuthContext);
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
              <h2>Sign up a new account</h2>
              <Form.Control
                type="text"
                placeholder="Name"
                onChange={(e) => updateRegisterInfo({
                  ...registerInfo,
                  name: e.target.value
                })}
              />
              <Form.Control
                type="text"
                placeholder="Email"
                onChange={(e) => updateRegisterInfo({
                  ...registerInfo,
                  email: e.target.value
                })}
              />
              <Form.Control
                type="text"
                placeholder="Password"
                onChange={(e) => updateRegisterInfo({
                  ...registerInfo,
                  password: e.target.value
                })}
              />
              <Button variant="primary" type="submit">
                Sign up
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

export default Register;