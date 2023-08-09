import { Form, Button, Row, Col } from "react-bootstrap";
import React, { useState } from "react";
import "./HomePageSearchService.css";

const HomePageSearchService = ({ search }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50);
  const [serviceArea, setServiceArea] = useState("Markham");
  const [pet, setPet] = useState("Dog");
  const [numberOfPet, setNumberOfPet] = useState(1);

  const service_find = () => {
    let url = `/service?locations=${serviceArea}&pet_breeds=${pet}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    window.location.href = url;
  };

  return (
    <div>
      <Form onSubmit={search}>
        <Row className="mb-3 searchRow aligh-item-center">
          <Form.Group as={Col} md={3} controlId="serviceArea">
            <Form.Label>Service Area</Form.Label>
            <Form.Control
              as="select"
              placeholder={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
            >
              <option>Markham</option>
              <option>Toronto</option>
              <option>Kirkland</option>
              <option>Edmonton</option>
              <option>Laval</option>
              <option>Scarborough</option>
              <option>Vancouver</option>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} md={2} controlId="minPrice">
            <Form.Label>Choose Min Price</Form.Label>
            <Form.Control
              type="number"
              placeholder={minPrice}
              onChange={(e) => {
                if (Number(e.target.value) < 0) {
                  e.target.value = 0;
                }
                setMinPrice(e.target.value);
              }}
              isInvalid={Number(minPrice) > Number(maxPrice)}
            />
            <Form.Control.Feedback type="invalid">
              Please select a valid range
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={2} controlId="maxPrice">
            <Form.Label>Choose Max Price</Form.Label>
            <Form.Control
              type="number"
              placeholder={maxPrice}
              onChange={(e) => {
                if (Number(e.target.value) < 0) {
                  e.target.value = 0;
                }
                setMaxPrice(e.target.value);
              }}
              isInvalid={Number(minPrice) > Number(maxPrice)}
            />
            <Form.Control.Feedback type="invalid">
              Please select a valid range
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md={2} controlId="Pet">
            <Form.Label>Pet</Form.Label>
            <Form.Control
              as="select"
              placeholder={pet}
              onChange={(e) => setPet(e.target.value)}
            >
              <option>Dog</option>
              <option>Cat</option>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} md={2} controlId="Num">
            <Form.Label>Number</Form.Label>
            <Form.Control
              as="select"
              placeholder={numberOfPet}
              onChange={(e) => setNumberOfPet(e.target.value)}
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
            </Form.Control>
          </Form.Group>

          <Col md={1}>
            <Button
              className="findButton"
              variant="primary"
              onClick={service_find}
            >
              Find
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default HomePageSearchService;
