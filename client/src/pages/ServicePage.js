import HeaderMenu from "../components/HeaderMenu";
import Footer from "../components/Footer";
import "../components/Filter.css";
import {
  Container,
  Card,
  Nav,
  Navbar,
  Form,
  Col,
  Row,
  Dropdown,
  Button,
  Alert,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ServicePage.css";

let display_num = 3;

const ServicePage = () => {
  const [services, setServices] = useState({ data: null, error: false });
  const [condition, setCondition] = useState({
    locations: "",
    pet_breeds: "",
    minPrice: 0,
    maxPrice: 10000,
    sortBy: "",
    sortDirection: "",
  });
  const [selectedL, setSelectedL] = useState({
    markham: false,
    toronto: false,
  });
  const [selectedP, setSelectedP] = useState({
    cat: false,
    dog: false,
    hamster: false,
    rabbit: false,
  });
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  // For categories
  useEffect(() => {
    selectedL.markham
      ? setCondition({ ...condition, locations: "Markham" })
      : selectedL.toronto
      ? setCondition({ ...condition, locations: "Toronto" })
      : setCondition({ ...condition, locations: "" });
  }, [selectedL]); // eslint-disable-line react-hooks/exhaustive-deps

  // For pet breeds
  useEffect(() => {
    selectedP.cat
      ? setCondition({ ...condition, pet_breeds: "Cat" })
      : selectedP.dog
      ? setCondition({ ...condition, pet_breeds: "Dog" })
      : selectedP.hamster
      ? setCondition({ ...condition, pet_breeds: "Hamster" })
      : selectedP.rabbit
      ? setCondition({ ...condition, pet_breeds: "Rabbit" })
      : setCondition({ ...condition, pet_breeds: "" });
  }, [selectedP]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let incoming_url = new URL(window.location.href);
    if (incoming_url.search === "") {
      conditions();
    } else {
      init_content(incoming_url);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const init_content = async (incoming_url) => {
    const init_url = `/api/services?${
      incoming_url.searchParams.get("locations") === ""
        ? ""
        : "locations=" + incoming_url.searchParams.get("locations")
    }${
      incoming_url.searchParams.get("pet_breeds") === ""
        ? ""
        : "&pet_breeds=" + incoming_url.searchParams.get("pet_breeds")
    }${
      incoming_url.searchParams.get("minPrice") === ""
        ? ""
        : "&minPrice=" + incoming_url.searchParams.get("minPrice")
    }${
      incoming_url.searchParams.get("maxPrice") === ""
        ? ""
        : "&maxPrice=" + incoming_url.searchParams.get("maxPrice")
    }`;
    await axios
      .get(init_url)
      .then((res) => {
        setServices({
          data: res.data,
          error: false,
        });
      })
      .catch(() => setServices({ error: true }));
  };

  const url = `/api/services?${
    condition.locations === "" ? "" : "locations=" + condition.locations
  }${condition.pet_breeds === "" ? "" : "&pet_breeds=" + condition.pet_breeds}${
    condition.minPrice === "" ? "" : "&minPrice=" + condition.minPrice
  }${condition.maxPrice === "" ? "" : "&maxPrice=" + condition.maxPrice}${
    condition.sortBy === "" ? "" : "&sortBy=" + condition.sortBy
  }${
    condition.sortDirection === ""
      ? ""
      : "&sortDirection=" + condition.sortDirection
  }`;

  const conditions = async () => {
    setServices({
      data: null,
      error: false,
    });
    await axios
      .get(url)
      .then((res) => {
        setServices({
          data: res.data,
          error: false,
        });
      })
      .catch(() => setServices({ error: true }));
  };

  const increment_display = () => {
    display_num = display_num + 3;
    conditions();
  };

  return (
    <>
      <HeaderMenu />
      <div className="pager">
        <Container>
          <Container className="mt-3 ">
            <Row className="mb-2">
              <Col>Featured Services</Col>
              <Col>
                <a
                  href="/createservice"
                  className="btn btn-dark end"
                  role="button">
                  Create service
                </a>
              </Col>
            </Row>
            <Container className="filter">
              <Navbar>
                <Nav className="me-auto filter_options">
                  <div>
                    <Nav.Link className="bold" style={{ cursor: "default" }}>
                      Location:
                    </Nav.Link>
                  </div>
                  <Nav.Link
                    onClick={() =>
                      setSelectedL({ toronto: !selectedL.toronto })
                    }>
                    {selectedL.toronto ? (
                      <span className="selected">Toronto</span>
                    ) : (
                      <span className="unselected">Toronto</span>
                    )}
                  </Nav.Link>
                  <Nav.Link
                    onClick={() =>
                      setSelectedL({ markham: !selectedL.markham })
                    }>
                    {selectedL.markham ? (
                      <span className="selected">Markham</span>
                    ) : (
                      <span className="unselected">Markham</span>
                    )}
                  </Nav.Link>
                </Nav>
              </Navbar>
              <Navbar>
                <Nav className="me-auto filter_options">
                  <Nav.Link className="bold" style={{ cursor: "default" }}>
                    Pet:
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => setSelectedP({ cat: !selectedP.cat })}>
                    {selectedP.cat ? (
                      <span className="selected">Cat</span>
                    ) : (
                      <span className="unselected">Cat</span>
                    )}
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => setSelectedP({ dog: !selectedP.dog })}>
                    {selectedP.dog ? (
                      <span className="selected">Dog</span>
                    ) : (
                      <span className="unselected">Dog</span>
                    )}
                  </Nav.Link>
                  <Nav.Link
                    onClick={() =>
                      setSelectedP({ hamster: !selectedP.hamster })
                    }>
                    {selectedP.hamster ? (
                      <span className="selected">Hamster</span>
                    ) : (
                      <span className="unselected">Hamster</span>
                    )}
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => setSelectedP({ rabbit: !selectedP.rabbit })}>
                    {selectedP.rabbit ? (
                      <span className="selected">Rabbit</span>
                    ) : (
                      <span className="unselected">Rabbit</span>
                    )}
                  </Nav.Link>
                </Nav>
              </Navbar>
            </Container>
          </Container>
          <hr />
          <Container>
            <Container className="sort mb-3">
              <Row>
                <Col>
                  <h6>Sort by</h6>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      Rating
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          setCondition({
                            ...condition,
                            sortBy: "service_rating",
                            sortDirection: "ASC",
                          })
                        }>
                        Ascending
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          setCondition({
                            ...condition,
                            sortBy: "service_rating",
                            sortDirection: "DESC",
                          })
                        }>
                        Descending
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>

                <Col>
                  <h6>Sort by</h6>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      Price
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          setCondition({
                            ...condition,
                            sortBy: "price_per_day",
                            sortDirection: "ASC",
                          })
                        }>
                        Ascending
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          setCondition({
                            ...condition,
                            sortBy: "price_per_day",
                            sortDirection: "DESC",
                          })
                        }>
                        Descending
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>

                <Col>
                  <h6>Range</h6>
                  <Form>
                    <Form.Group md={1} controlId="minPrice">
                      <Form.Control
                        type="number"
                        placeholder="Min Price"
                        onChange={(e) => {
                          if (Number(e.target.value) < 0) {
                            e.target.value = 0;
                          }
                          setMinPrice(Number(e.target.value));
                          setCondition({
                            ...condition,
                            minPrice: Number(e.target.value),
                          });
                        }}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mt-1 mb-1"
                      md={1}
                      controlId="maxPrice">
                      <Form.Control
                        type="number"
                        placeholder="Max Price"
                        onChange={(e) => {
                          if (Number(e.target.value) < 0) {
                            e.target.value = 0;
                          }
                          setMaxPrice(Number(e.target.value));
                          setCondition({
                            ...condition,
                            maxPrice: Number(e.target.value),
                          });
                          if (Number(e.target.value) === 0) {
                            setCondition({
                              ...condition,
                              maxPrice: 10000,
                            });
                          }
                        }}
                        isInvalid={minPrice > maxPrice}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select a valid range
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form>
                </Col>
                <Col md={1}>
                  <Button
                    className="findButton"
                    variant="primary"
                    onClick={conditions}>
                    Find
                  </Button>
                </Col>
              </Row>
            </Container>
          </Container>
          {services.error && (
            <div className="alert alert-warning" role="alert">
              Error while fetching services, please try again later.
            </div>
          )}
          <Container className="mb-3 mid">
            {services.data ? (
              <div style={{ width: "inherit" }}>
                <Row xs={1} md={2} lg={3} className="g-4">
                  {services.data
                    .map((service) => (
                      <Col key={service.service_id}>
                        <Card border="light" bg="light">
                          <Card.Img
                            style={{ objectFit: "cover" }}
                            variant="top"
                            height="450vw"
                            src={`/api/images?image_name=${service.service_pic_url[0]}`}
                          />
                          <Card.Body>
                            <Card.Title>
                              <Row>
                                <Col>{service.service_title}</Col>
                                <Col xs="auto" className="price_rating">
                                  ${service.price_per_day}
                                </Col>
                              </Row>
                            </Card.Title>
                            <Card.Subtitle>
                              <Row>
                                <Col>{service.service_detail}</Col>
                                <Col xs="auto" className="price_rating">
                                  Rating: {service.service_rating}
                                </Col>
                              </Row>
                            </Card.Subtitle>
                            <Card.Subtitle>
                              <Row>
                                <Col className="price_rating mt-1">
                                  ({service.location})
                                </Col>
                              </Row>
                            </Card.Subtitle>

                            <Button
                              variant="primary mt-2"
                              onClick={() => {
                                window.location.href = `/service/s${service.service_id}`;
                              }}>
                              Go to Service
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                    .slice(0, display_num)}
                </Row>
                {services.data.length === 0 ? (
                  <Alert variant="light" className="mt-4">
                    No relevant services found!
                  </Alert>
                ) : (
                  <div className="d-grid gap-2 button_width">
                    <Button variant="primary mt-4" onClick={increment_display}>
                      Show More
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div></div>
            )}
          </Container>
        </Container>
      </div>

      <Footer />
    </>
  );
};

export default ServicePage;
