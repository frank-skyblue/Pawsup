import HeaderMenu from "../components/HeaderMenu";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Button,
  Form,
  Col,
  Row,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import "./CreateMedia.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateMediaPage = () => {
  const [filled, setfilled] = useState({
    author_id: 1,
    media_picture_url: [""],
    media_title: "",
    media_detail: "",
    published_time: "",
    number_of_likes: 0,
  });
  const [status, setStatus] = useState({ isLoggedIn: false, user: null });
  const [posted, setposted] = useState(false);
  const [loading, setloading] = useState(true);
  const [file, setFile] = useState(null);
  const [hasError, setHasError] = useState({
    duplicate: false,
    missInfo: false,
    internal: false,
  });
  const [picError, setPicError] = useState(false);
  const [pic, setPic] = useState(false);
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setPic(true);
    setfilled({ ...filled, media_picture_url: [e.target.files[0].name] });
  };

  useEffect(() => {
    axios
      .get("/api/auth/user")
      .then((res) => {
        setStatus(res.data);
        setloading(false);
      })
      .catch(() => setloading(true));
  }, []);

  useEffect(() => {
    posted && (window.location = "/media");
  }, [posted]);

  const Createpost = async () => {
    if (pic) {
      const fd = new FormData();
      fd.append("img", file, file.name);
      await axios
        .post("/api/images", fd, config)
        .then(() => {})
        .catch(() => {
          setPicError(true);
        });

      await axios
        .post("/api/mediapages", {
          author_id: status.user.uid,
          media_picture_url: filled.media_picture_url,
          media_title: filled.media_title,
          media_detail: filled.media_detail,
          published_time: new Date().toLocaleDateString(),
          number_of_likes: 1,
        })
        .then(() => {
          setposted(true);
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
    } else {
      setPicError(true);
    }
  };

  const posttitle = (event) => {
    setfilled({ ...filled, media_title: event.target.value });
  };

  const postdetail = (event) => {
    setfilled({ ...filled, media_detail: event.target.value });
  };

  return (
    <>
      <HeaderMenu />
      {loading ? (
        <div className="page">
          <Spinner animation="grow" variant="primary" />
          <h3 className="mt-4">Loading...</h3>
        </div>
      ) : status.isLoggedIn ? (
        <div>
          <h1 align="center">Create a post!</h1>
          <Container>
            <Card bg="light">
              <Container className="detail">
                <Form className="detail mt-5" onSubmit={submitHandler}>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Row>
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                          as="textarea"
                          value={filled.media_title}
                          onChange={posttitle}
                          placeholder="Enter title"
                        />
                      </Row>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Row>
                        <Form.Label>Detail *</Form.Label>

                        <Form.Control
                          as="textarea"
                          rows={5}
                          value={filled.media_detail}
                          onChange={postdetail}
                          placeholder="Enter detail"
                        />
                      </Row>
                    </Form.Group>

                    <Form.Group controlId="formFileLg" className="mb-3 detail">
                      <Row>
                        <Form.Label>Upload a picture *</Form.Label>
                        <Form.Control type="file" onChange={handleFile} />
                      </Row>
                    </Form.Group>

                    {hasError.missInfo ? (
                      <Alert variant="danger">
                        Please enter all required fields
                      </Alert>
                    ) : null}
                    {picError ? (
                      <Alert variant="danger">Your post needs a picture</Alert>
                    ) : null}
                    <Row>
                      <Col className="subform">
                        <Button variant="primary" onClick={Createpost}>
                          Post
                        </Button>
                      </Col>
                      <Col className="subform">
                        <Button href="/media" variant="primary" type="submit">
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Form>
              </Container>
            </Card>
          </Container>
        </div>
      ) : (
        (window.location = "/signin")
      )}

      <Footer />
    </>
  );
};

export default CreateMediaPage;
