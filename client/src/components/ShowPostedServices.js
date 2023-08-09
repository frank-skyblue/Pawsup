import React, { useState, useEffect } from "react";
import { Button, Container, Row, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
const ShowPostedServices = ({ data }) => {
  const [listServices, setListServices] = useState({
    data: null,
    error: false,
  });
  const getUserServices = () => {
    axios
      .get(`/api/services/for_user/${data.uid}`)
      .then((res) => {
        setListServices({
          data: res.data,
          error: false,
        });
      })
      .catch(() => setListServices({ error: true }));
  };
  const removeService = (id) => {
    axios
      .delete(`/api/services/${id}`)
      .then(() => {
        window.location = "/realaccountpage";
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getUserServices();
  }, [data.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  if (data.uid === null) {
    return <p>Loading</p>;
  }
  if (listServices.data === null) {
    return <p>Loading</p>;
  }

  return (
    <>
      <Container className="pt-5 pb-3 accountPg">
        {listServices.data.length === 0 ? (
          <>
            <h1>You have no Posted Service</h1>
            <a href="/createservice" className="btn btn-dark end" role="button">
              Create service
            </a>
          </>
        ) : (
          <>
            <h1>List of Your Posted Services</h1>
            <div style={{ width: "inherit" }}>
              <Row xs={1} md={2} lg={3} className="g-4">
                {listServices.data.map((service) => (
                  <Col key={service.service_id}>
                    <Card border="light" bg="light">
                      <Card.Img
                        variant="top"
                        style={{ objectFit: "cover" }}
                        height="450vw"
                        src={`/api/images?image_name=${service.service_pic_url?.[0]}`}
                      />
                      <Card.Body>
                        <Card.Title>
                          <Row>
                            <Col>
                              <Link to={`/service/s${service.service_id}`}>
                                {service.service_title}
                              </Link>
                            </Col>
                            <Col xs="auto" className="price_rating">
                              ${service.price_per_day}/day
                            </Col>
                          </Row>
                        </Card.Title>

                        <Button
                          className="mt-2"
                          variant="danger"
                          onClick={() => removeService(service.service_id)}
                        >
                          Remove Service{" "}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default ShowPostedServices;
