import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const FeaturedProducts = () => {
  const [products, setProducts] = useState({ data: null, error: false });

  useEffect(() => {
    conditions();
  }, []);

  const conditions = async () => {
    await axios
      .get("/api/products")
      .then((res) => {
        setProducts({
          data: res.data,
          error: false,
        });
      })
      .catch(() => setProducts({ error: true }));
  };

  return (
    <div className="mt-3">
      <Container>
        <h4 className="mt3">Featured Products</h4>

        {products.data ? (
          <div>
            <Row xs={1} md={2} className="g-4">
              {products.data
                .map((product) => (
                  <Col key={product.product_id}>
                    <Card border="light" bg="light">
                      <Card.Img
                        style={{ objectFit: "cover" }}
                        height="450vw"
                        variant="top"
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
                              ({product.product_category})
                            </Col>
                          </Row>
                        </Card.Subtitle>

                        <Button
                          variant="primary mt-2"
                          onClick={() => {
                            window.location.href = `/product/p${product.product_id}`;
                          }}
                        >
                          Go to Product
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
                .slice(0, 2)}
            </Row>
            {products.data.length === 0 ? (
              <Alert variant="light" className="mt-4">
                No relevant products found!
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

export default FeaturedProducts;
