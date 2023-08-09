import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const FeaturedServices = () => {
  const [services, setServices] = useState({ data: null, error: false });

  useEffect(() => {
    conditions();
  }, []);

  const conditions = async () => {
    await axios
      .get("/api/services")
      .then((res) => {
        setServices({
          data: res.data,
          error: false,
        });
      })
      .catch(() => setServices({ error: true }));
  };

  return (
    <div>
      <Container>
        <h4 className="mt3">Featured Services</h4>

        {services.data ? (
          <div>
            <Row xs={1} md={2} className="g-4">
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
                          }}
                        >
                          Go to Service
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
                .slice(0, 2)}
            </Row>
            {services.data.length === 0 ? (
              <Alert variant="light" className="mt-4">
                No relevant services found!
              </Alert>
            ) : null}
          </div>
        ) : (
          <div></div>
        )}
      </Container>
    </div>
  );
};

export default FeaturedServices;
