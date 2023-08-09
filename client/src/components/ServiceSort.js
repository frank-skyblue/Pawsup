import React, { useState } from "react";
import { Form, Col, Row, Dropdown, Container } from "react-bootstrap";

const ServiceSort = ({ search }) => {
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();

  return (
    <div>
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
                  <Dropdown.Item href="#/action-1">Ascending</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Descending</Dropdown.Item>
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
                  <Dropdown.Item href="#/action-1">Ascending</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Descending</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>

            <Col>
              <h6>Range</h6>
              <Form onSubmit={search}>
                <Form.Group md={1} controlId="minPrice">
                  <Form.Control
                    type="number"
                    placeholder="Min Price"
                    onChange={(e) => setMinPrice(e.target.value)}
                    isInvalid={minPrice > maxPrice}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please select a valid range
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-1 mb-1" md={1} controlId="maxPrice">
                  <Form.Control
                    type="number"
                    placeholder="Max Price"
                    onChange={(e) => setMaxPrice(e.target.value)}
                    isInvalid={minPrice > maxPrice}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please select a valid range
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  );
};

export default ServiceSort;
