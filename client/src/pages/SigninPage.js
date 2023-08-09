import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import HeaderMenu from "../components/HeaderMenu";
import "./SigninPage.css";
import axios from "axios";

const SigninPage = () => {
  const [details, setDetails] = useState({ name: "", password: "" });
  const [hasError, setHasError] = useState(false);
  const [pass, setPass] = useState(false);

  useEffect(() => {
    pass && (window.location = "/");
  }, [pass]);

  const checkLogin = async () => {
    setHasError(false);
    await axios
      .post("/api/auth/login", {
        username: details.name,
        password: details.password,
      })
      .then(() => {
        setPass(true);
      })
      .catch(() => {
        setHasError(true);
      });
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <HeaderMenu />
      <div className="page bg-white">
        <div>
          <Container fluid>
            <Form onSubmit={submitHandler}>
              <Row md>
                <Col>
                  <Form.Group
                    className="mb-3 form-signin"
                    controlId="formEmail"
                  >
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Username"
                      onChange={(e) =>
                        setDetails(
                          { ...details, name: e.target.value },
                          setHasError(false)
                        )
                      }
                      value={details.name}
                    />
                  </Form.Group>
                </Col>
                <Form.Group
                  className="mb-3 form-signin"
                  controlId="formPassword"
                >
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) =>
                      setDetails(
                        { ...details, password: e.target.value },
                        setHasError(false)
                      )
                    }
                    value={details.password}
                  />
                </Form.Group>
              </Row>
              <Row>
                {hasError && (
                  <div className="alert alert-warning mid" role="alert">
                    Wrong Login info. Please try again.
                  </div>
                )}
                <Button
                  className="mb-2"
                  variant="primary"
                  type="submit"
                  size="lg"
                  onClick={checkLogin}
                >
                  Login
                </Button>
              </Row>
              <Row>
                <Form.Text className="text-black form-control-md-8">
                  Don't have an account yet? Sign up!
                </Form.Text>
              </Row>
              <Row>
                <a href="/signup" className="btn btn-dark" role="button">
                  Sign up
                </a>
              </Row>
            </Form>
          </Container>
        </div>
      </div>
    </>
  );
};

export default SigninPage;
