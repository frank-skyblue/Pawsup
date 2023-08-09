import React, { useState, useEffect } from "react";
import HeaderMenu from "../components/HeaderMenu";
import Footer from "../components/Footer";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import "./SignupPage.css";
import axios from "axios";

function CreateService() {
  const [service, setService] = useState({
    service_pic_url: [""],
    service_title: "",
    service_detail: "",
    service_facility: ["", "", ""],
    location: "Toronto",
    price_per_day: "",
    service_rating: "",
    service_pet_breed: "Dog",
  });
  const [hasError, setHasError] = useState(false);
  const [picError, setPicError] = useState(false);
  const [pic, setPic] = useState(false);
  const [status, setStatus] = useState({ isLoggedIn: false, user: null });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);

    setPic(true);
    if (!pic) {
      setPicError(false);
    } else {
      setPicError(true);
    }
    setService({ ...service, service_pic_url: [e.target.files[0].name] });
  };

  useEffect(() => {
    axios
      .get("/api/auth/user")
      .then((res) => {
        setStatus(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  /* const upImg = async () => {
    const fd = new FormData();
    fd.append("img", file, file.name);
    await axios
      .post("/api/images", fd, config)
      .then(() => {
      })
      .catch(() => {
      });
  }; */

  const Create = async () => {
    if (pic) {
      const fd = new FormData();
      fd.append("img", file, file.name);
      await axios
        .post("/api/images", fd, config)
        .then(() => {})
        .catch(() => {});

      await axios
        .post("/api/services", {
          service_pic_url: service.service_pic_url,
          service_title: service.service_title,
          service_detail: service.service_detail,
          service_facility: service.service_facility,
          location: service.location,
          price_per_day: service.price_per_day,
          service_rating: service.service_rating,
          service_pet_breed: service.service_pet_breed,
          user_id: status.user.uid,
        })
        .then(() => {
          window.location = "/service";
        })
        .catch(() => {
          setHasError(true);
        });
    } else {
      setPicError(true);
    }
  };

  return (
    <>
      <HeaderMenu />
      {loading ? (
        <div className="page">
          <Spinner animation="grow" variant="primary" />
          <p>Loading...</p>
        </div>
      ) : status.isLoggedIn ? (
        <div className="pageform">
          <Row>
            <Col>
              <h2 className="mb-4 mt-3">Create Service</h2>
            </Col>
          </Row>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3 bold">
              <Form.Label>Service Title</Form.Label>
              <Form.Control
                type="text"
                value={service.service_title}
                placeholder="Enter service title"
                onChange={(e) =>
                  setService({ ...service, service_title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group lg={4} className="mb-3 bold">
              <Form.Label>Service Details</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                value={service.service_detail}
                placeholder="Enter Service Details"
                onChange={(e) =>
                  setService({ ...service, service_detail: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3 bold">
              <Form.Label>Service Price(per day)</Form.Label>
              <Form.Control
                type="number"
                value={service.price_per_day}
                placeholder="Enter Service Price per day"
                onChange={(e) =>
                  setService({ ...service, price_per_day: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3 bold">
              <Form.Label>Service Facility (up to 3)</Form.Label>
              <Form.Control
                type="text"
                value={service.service_facility[0]}
                placeholder="Enter Service Facility 1"
                onChange={(e) =>
                  setService({
                    ...service,
                    service_facility: [
                      e.target.value,
                      service.service_facility[1],
                      service.service_facility[2],
                    ],
                  })
                }
              />
              <Form.Control
                type="text"
                value={service.service_facility[1]}
                placeholder="Enter Service Facility 2"
                onChange={(e) =>
                  setService({
                    ...service,
                    service_facility: [
                      service.service_facility[0],
                      e.target.value,
                      service.service_facility[2],
                    ],
                  })
                }
              />
              <Form.Control
                type="text"
                value={service.service_facility[2]}
                placeholder="Enter Service Facility 3"
                onChange={(e) =>
                  setService({
                    ...service,
                    service_facility: [
                      service.service_facility[0],
                      service.service_facility[1],
                      e.target.value,
                    ],
                  })
                }
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group
                  className="mb-3 bold"
                  as={Col}
                  md={3}
                  controlId="service.location"
                >
                  <Form.Label>Service Location</Form.Label>
                  <Form.Control
                    as="select"
                    type="text"
                    placeholder={service.location}
                    onChange={(e) =>
                      setService({ ...service, location: e.target.value })
                    }
                  >
                    <option>Toronto</option>
                    <option>Markham</option>
                    <option>Kirkland</option>
                    <option>Edmonton</option>
                    <option>Laval</option>
                    <option>Scarborough</option>
                    <option>Vancouver</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3 bold">
                  <Form.Label>Service Rating (0 - 5)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={service.service_rating}
                    placeholder="Enter Service Rating"
                    onChange={(e) => {
                      if (Number(e.target.value) < 0) {
                        e.target.value = 0;
                      }
                      if (Number(e.target.value) > 5.0) {
                        e.target.value = 5.0;
                      }
                      setService({
                        ...service,
                        service_rating: e.target.value,
                      });
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group
              className="mb-3 bold"
              as={Col}
              md={3}
              controlId="service.service_pet_breed"
            >
              <Form.Label>Service Pet Breed</Form.Label>
              <Form.Control
                as="select"
                type="text"
                placeholder={service.service_pet_breed}
                onChange={(e) =>
                  setService({ ...service, service_pet_breed: e.target.value })
                }
              >
                <option>Dog</option>
                <option>Cat</option>
                <option>Hamster</option>
                <option>Rabbit</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3 bold">
              <Form.Label>
                Service Sample picture (must select exactly 1 picture)
              </Form.Label>
              <input type="file" onChange={handleFile} />
            </Form.Group>

            {picError && (
              <div className="alert alert-warning mb-3 mid" role="alert">
                Your service post needs a picture
              </div>
            )}
            {hasError && (
              <div className="alert alert-warning mb-3 mid" role="alert">
                Please enter all required information.
              </div>
            )}

            <Row>
              <Col className="mid">
                <Button
                  className="mb-3 btn bigger"
                  variant="primary"
                  onClick={Create}
                >
                  Create Service
                </Button>
              </Col>
              <Col className="mid">
                <Button
                  className="mb-3 btn  bigger"
                  variant="primary"
                  href="/service"
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
          <Footer />
        </div>
      ) : (
        (window.location = "/signin")
      )}
    </>
  );
}

export default CreateService;
