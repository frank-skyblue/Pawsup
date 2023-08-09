import HeaderMenu from "../components/HeaderMenu";
import Footer from "../components/Footer";
import "../components/Filter.css";
import {
  Container,
  Nav,
  Navbar,
  Form,
  Col,
  Row,
  Dropdown,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductPage.css";
// import { Link } from "react-router-dom";

let display_num = 3;

const ProductPage = () => {
  const [products, setProducts] = useState({ data: null, error: false });
  const [condition, setCondition] = useState({
    category: "",
    pet_breeds: "",
    minPrice: 0,
    maxPrice: 10000,
    sortBy: "",
    sortDirection: "",
  });
  const [selectedC, setSelectedC] = useState({
    food: false,
    toy: false,
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
    selectedC.toy
      ? setCondition({ ...condition, category: "Toy" })
      : selectedC.food
      ? setCondition({ ...condition, category: "Food" })
      : setCondition({ ...condition, category: "" });
  }, [selectedC]); // eslint-disable-line react-hooks/exhaustive-deps

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
    conditions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const urls = `/api/products?${
    condition.category === "" ? "" : "categories=" + condition.category
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
    setProducts({
      data: null,
      error: false,
    });
    await axios
      .get(urls)
      .then((res) => {
        setProducts({
          data: res.data,
          error: false,
        });
      })
      .catch(() => setProducts({ error: true }));
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
          {/* Filter Bar */}
          <Container className="mt-3">
            <Col className="mb-3">Featured Products</Col>
            <Container className="filter">
              <Navbar className="nav_active">
                <Nav className="me-auto filter_options">
                  <div>
                    <Nav.Link
                      className="nav_default bold"
                      style={{ cursor: "default" }}>
                      Category:
                    </Nav.Link>
                  </div>
                  <Nav.Link
                    onClick={() => setSelectedC({ toy: !selectedC.toy })}>
                    {selectedC.toy ? (
                      <span className="selected">Toy</span>
                    ) : (
                      <span className="unselected">Toy</span>
                    )}
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => setSelectedC({ food: !selectedC.food })}>
                    {selectedC.food ? (
                      <span className="selected">Food</span>
                    ) : (
                      <span className="unselected">Food</span>
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
                            sortBy: "product_rating",
                            sortDirection: "ASC",
                          })
                        }>
                        Ascending
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          setCondition({
                            ...condition,
                            sortBy: "product_rating",
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
                            sortBy: "product_price",
                            sortDirection: "ASC",
                          })
                        }>
                        Ascending
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          setCondition({
                            ...condition,
                            sortBy: "product_price",
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
                        isInvalid={minPrice > maxPrice}
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
          {products.error && (
            <div className="alert alert-warning mid" role="alert">
              Error while fetching products, please try again later.
            </div>
          )}
          <Container className="mb-3 mid">
            {products.data ? (
              <div style={{ width: "inherit" }}>
                <Row xs={1} md={2} lg={3} className="g-4">
                  {products.data
                    .map((product, index) => (
                      <Col key={index}>
                        <Card border="light" bg="light">
                          <Card.Img
                            style={{ objectFit: "cover" }}
                            variant="top"
                            height="450vw"
                            src={`/api/images?image_name=${product.product_pic_url[0]}`}
                          />
                          <Card.Body>
                            <Card.Title>
                              <Row>
                                <Col>{product.product_name}</Col>
                                <Col xs="auto" className="price_rating">
                                  ${product.product_price[0]}
                                </Col>
                              </Row>
                            </Card.Title>
                            <Card.Subtitle>
                              <Row>
                                <Col>{product.product_detail}</Col>
                                <Col xs="auto" className="price_rating">
                                  Rating: {product.product_rating}
                                </Col>
                              </Row>
                            </Card.Subtitle>
                            <Card.Subtitle>
                              <Row>
                                <Col className="price_rating mt-1">
                                  {product.product_category}
                                </Col>
                              </Row>
                            </Card.Subtitle>
                            <Button
                              variant="primary mt-2"
                              onClick={() => {
                                window.location.href = `/product/p${product.product_id}`;
                              }}>
                              Go to Product
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                    .slice(0, display_num)}
                </Row>
                {products.data.length === 0 ? (
                  <Alert variant="light" className="mt-4">
                    No relevant products found!
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

export default ProductPage;
