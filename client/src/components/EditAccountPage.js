import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Button,
  Form,
  Col,
  Row,
  Alert,
  Card,
} from "react-bootstrap";
import "./EditAccountPage.css";
import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const EditAccountPage = () => {
  const [status, setStatus] = useState({ isLoggedIn: false, user: null });
  const [changed, setchanged] = useState(false);
  const [hasError, setHasError] = useState({
    duplicate: false,
    missInfo: false,
    internal: false,
  });

  const [avatar, setavatar] = useState(null);
  const [file, setFile] = useState(null);
  //const [picError, setPicError] = useState(false);
  const [pic, setPic] = useState(false);
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    axios
      .get("/api/auth/user")
      .then((res) => setStatus(res.data))
      .catch();
  }, []);

  useEffect(() => {
    changed && (window.location = "/realaccountpage");
  }, [changed]);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setPic(true);
    setavatar(e.target.files[0].name);
  };

  const Savechanges = async (data) => {
    if (pic) {
      const fd = new FormData();
      fd.append("img", file, file.name);
      await axios
        .post("/api/images", fd, config)
        .then(() => {})
        .catch(() => {});
    }
    await axios
      .put(`/api/user/${status.user.uid}`, {
        avatar: avatar,
        email: data.email,
        password: data.password,
        phone_number: data.phonenumber,
        city: data.location,
      })
      .then(() => {
        setchanged(true);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setHasError({ missInfo: true });
        } else if (err.response.status === 401) {
          setHasError({ duplicate: true });
        } else {
          setHasError({ internal: true });
        }
      });
  };

  return (
    <>
      {status.isLoggedIn ? (
        <div>
          <Container className="containercenter">
            <Form
              onSubmit={handleSubmit(Savechanges)}
              className="editaccountformwidth"
            >
              <Form.Group
                as={Row}
                className="mb-3 form"
                controlId="formPlaintextEmail"
              >
                <Form.Label column>Your Avatar:</Form.Label>
                <Card border="light" bg="light">
                  <Card.Img
                    style={{ objectFit: "cover" }}
                    variant="top"
                    height="450vw"
                    src={`/api/images?image_name=${status.user.avatar}`}
                  />
                </Card>
                <Form.Label column>
                  Upload a picture to update your current Avatar:
                </Form.Label>
                <Form.Control type="file" onChange={handleFile}></Form.Control>
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-3 form"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="2">
                  Email
                </Form.Label>
                <Col className="editbutton">
                  <input
                    placeholder={status.user.email}
                    {...register("email", {
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                        message: "This is not a valid email",
                      },
                    })}
                  />
                </Col>
                {errors.email && (
                  <Alert variant="warning">{errors.email.message}</Alert>
                )}
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-3 form"
                controlId="formPlaintextPassword"
              >
                <Form.Label column sm="2">
                  Password
                </Form.Label>
                <Col className="editbutton">
                  <input
                    type="password"
                    placeholder={status.user.password}
                    {...register("password")}
                  />
                </Col>
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-3 form"
                controlId="formPlaintextUid"
              >
                <Form.Label column>Phone number</Form.Label>
                <Col className="editbutton">
                  <input
                    type="text"
                    placeholder={status.user.phone_number}
                    {...register("phonenumber", {
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Numbers only",
                      },
                      /* minLength: {
                        value: 10,
                        message: "Not a 10 digits phone number",
                      },
                      maxLength: {
                        value: 10,
                        message: "Not a 10 digits phone number",
                      }, */
                    })}
                  />
                </Col>
                {errors.phonenumber && (
                  <Alert variant="warning">{errors.phonenumber.message}</Alert>
                )}
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-3 form"
                controlId="formPlaintextLocation"
              >
                <Form.Label column sm="2">
                  Location
                </Form.Label>
                <Col className="editbutton">
                  <input
                    type="text"
                    placeholder={status.user.city}
                    {...register("location")}
                  />
                </Col>
              </Form.Group>

              {hasError.missInfo ? (
                <Alert as={Row} variant="warning">
                  No changes were made
                </Alert>
              ) : null}
              <Container className="thetwobuttons">
                <Button variant="primary" type="submit">
                  Save changes!
                </Button>

                <Button variant="primary" href="/">
                  Cancel
                </Button>
              </Container>
            </Form>
          </Container>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default EditAccountPage;
