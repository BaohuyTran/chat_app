import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const authContext = useContext(AuthContext);
  return (
    <>
      <Form onSubmit={authContext.loginUser}>
        <Row style={{
          height: "100vh",
          justifyContent: "center",
          paddingTop: "10px",
        }}>
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Welcome back!</h2>
              <Form.Control
                type="text"
                placeholder="Email"
                onChange={(e) => authContext.updateLoginInfo({
                  ...authContext.loginInfo,
                  email: e.target.value
                })}
              />
              <Form.Control
                type="text"
                placeholder="Password"
                onChange={(e) => authContext.updateLoginInfo({
                  ...authContext.loginInfo,
                  password: e.target.value
                })}
              />
              <Button variant="primary" type="submit">
                {authContext.isLoading ? "Wait a second!!" : "Log in"}
              </Button>
              <Alert variant="danger">
                <p> ༼ つ⇧ ◕_◕ ༽つ⇧ --- {authContext.error?.message || "Hello!"}</p>
              </Alert>
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default Login;