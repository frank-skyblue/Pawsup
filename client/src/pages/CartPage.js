import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row, Spinner, Card, Col } from "react-bootstrap";
import HeaderMenu from "../components/HeaderMenu";
import Footer from "../components/Footer";
import { useCartContext } from "../providers/CartProvider";
import { useLocation, useHistory } from "react-router-dom"; 
import axios from "axios";
import "./CartPage.css";

const calculateDateDiff = (startDate, endDate) => {
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
};

const CartPage = () => {
  const {
    userInfo,
    hasError,
    cartItems,
    setCartItems,
    refreshUserInfoAndCart,
  } = useCartContext();
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deletingService, setDeletingService] = useState(null);
  const [cError, setcError] = useState(false);
  const [cSucc, setcSucc] = useState(false);
  const productsSubtotal = useMemo(() => {
    if (loading) {
      return 0;
    }
    let productsSubtotal = 0;
    cartItems.products.forEach((product) => {
      const sizeIndex = product.product_type.indexOf(product.size);
      productsSubtotal += product.product_price[sizeIndex] * product.quantity;
    });
    return productsSubtotal.toFixed(2);
  }, [cartItems, loading]);
  const servicesSubtotal = useMemo(() => {
    if (loading) {
      return 0;
    }
    let servicesSubtotal = 0;

    cartItems.services.forEach((service) => {
      const numberOfDays = calculateDateDiff(
        service.start_date,
        service.end_date
      );
      servicesSubtotal +=
        service.price_per_day * numberOfDays * service.number_of_pets;
    });
    return servicesSubtotal.toFixed(2);
  }, [cartItems, loading]);

  let total = +productsSubtotal + +servicesSubtotal;
  const numProducts = cartItems.products.reduce(
    (num, product) => (num += product.quantity),
    0
  );
  const numServices = cartItems.services.length;

  useEffect(() => {
    if (location.search.includes("checkout=success")) {
      setcSucc(true);
      history.replace({ search: "" });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    refreshUserInfoAndCart().then(() => {
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const removeProduct = (id) => {
    if (deletingProduct !== null) {
      return;
    }
    setDeletingProduct(id);
    axios
      .delete(`/api/cart/product/${id}`)
      .then((response) => {
        setCartItems({
          ...cartItems,
          products: cartItems.products.filter((product) => product.id !== id),
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setDeletingProduct(null);
      });
  };

  const removeService = (id) => {
    if (deletingService !== null) {
      return;
    }
    setDeletingService(id);
    axios
      .delete(`/api/cart/service/${id}`)
      .then((response) => {
        setCartItems({
          ...cartItems,
          services: cartItems.services.filter((service) => service.id !== id),
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setDeletingService(null);
      });
  };

  // const checkout = async () => {
  //   await axios
  //     .post("/api/payment", {
  //       total: total,
  //       redirect: window.location.href,
  //     })
  //     .then(() => {
  //       axios
  //         .delete("/api/cart")
  //         .then(() => {
  //           setcError(false);
  //           setcSucc(true);
  //           window.location = "/cart";
  //         })
  //         .catch(() => {
  //           setcError(true);
  //         });
  //     })
  //     .catch(() => {
  //       setcError(true);
  //     });
  // };

  const checkout = async () => {
    await axios
    .post("/api/payment", {
      total: total,
      redirect: `${window.location.origin}/cart/checkout`,
      cancelRedirect: `${window.location.origin}/cart`,
    })
    .then((res) => {
      window.location.href = res.data.paypal;
    })
    .catch(() => {
      setcError(true);
    });
  };

  if (loading) {
    return (
      <>
        <HeaderMenu />
        <div className="center">
          <div>
            <Spinner animation="grow" variant="primary" />
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (hasError) {
    return (
      <>
        <HeaderMenu />
        <div className="center">
          <h2>Unable to retrieve your cart data. Please try again later.</h2>
        </div>
      </>
    );
  }

  if (!userInfo.isLoggedIn) {
    return (
      <>
        <HeaderMenu />
        <div className="center">
          <h2>Please login to access your cart.</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderMenu />
      <Container className="pt-5 pb-3">
        {cSucc && (
          <div className="alert alert-success mb-3 mid mt-3" role="alert">
            Purchase Success!
          </div>
        )}
        <h2>Your Cart</h2>
        <h3>Products {numProducts > 0 && `(${cartItems.products.length})`}</h3>
        <div>
          {numProducts > 0 && (
            <div style={{ width: "inherit" }}>
              <Row xs={1} md={2} lg={3} className="g-4">
                {cartItems.products.map((product) => (
                  <Col key={product.id}>
                    <Card border="light" bg="light">
                      <Card.Img
                        style={{ objectFit: "cover" }}
                        height="450vw"
                        variant="top"
                        src={`/api/images?image_name=${product.product_pic_url?.[0]}`}
                      />
                      <Card.Body>
                        <Card.Title>
                          <Row>
                            <Col>
                              <Link to={`/product/p${product.product_id}`}>
                                {product.product_name}
                              </Link>
                            </Col>
                            <Col xs="auto" className="price_rating">
                              $
                              {
                                product.product_price?.[
                                  product.product_type.indexOf(product.size)
                                ]
                              }
                            </Col>
                          </Row>
                          <Card.Subtitle>
                            <Row>
                              <Col className="mt-3">
                                Size: <strong>{product.size}</strong>
                              </Col>
                            </Row>
                            <Row>
                              <Col className="mt-2">
                                Quantity: <strong>{product.quantity}</strong>
                              </Col>
                            </Row>
                          </Card.Subtitle>
                        </Card.Title>
                        <Button
                          className="mt-2"
                          disabled={deletingProduct === product.id}
                          variant="danger"
                          onClick={() => removeProduct(product.id)}
                        >
                          Remove from Cart{" "}
                          {deletingProduct === product.id && (
                            <Spinner animation="border" size="sm" />
                          )}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <div className="mt-3">
                <p>
                  Subtotal ({numProducts} item{numProducts > 1 ? "s" : ""}):{" "}
                  <strong>${productsSubtotal}</strong>{" "}
                </p>
              </div>
            </div>
          )}
          {!numProducts && <p>You currently have no products in your cart.</p>}
        </div>
        <hr />
        <h3>Services {numServices > 0 && `(${cartItems.services.length})`}</h3>
        <div>
          {numServices > 0 && (
            <div style={{ width: "inherit" }}>
              <Row xs={1} md={2} lg={3} className="g-4">
                {cartItems.services.map((service) => (
                  <Col key={service.id}>
                    <Card border="light" bg="light">
                      <Card.Img
                        style={{ objectFit: "cover" }}
                        height="450vw"
                        variant="top"
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
                        <Card.Subtitle>
                          <Row>
                            <Col className="mt-3">
                              Duration: <strong>{service.start_date}</strong> to{" "}
                              <strong>{service.end_date}</strong>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="mt-2">
                              # of Days:{" "}
                              <strong>
                                {calculateDateDiff(
                                  service.start_date,
                                  service.end_date
                                )}
                              </strong>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="mt-2">
                              # of Pets:{" "}
                              <strong>{service.number_of_pets}</strong>
                            </Col>
                          </Row>
                        </Card.Subtitle>
                        <Button
                          className="mt-2"
                          disabled={deletingService === service.id}
                          variant="danger"
                          onClick={() => removeService(service.id)}
                        >
                          Remove from Cart{" "}
                          {deletingService === service.id && (
                            <Spinner animation="border" size="sm" />
                          )}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <div className="mt-3">
                <p>
                  Subtotal ({numServices} item{numServices > 1 ? "s" : ""}):{" "}
                  <strong>${servicesSubtotal}</strong>{" "}
                </p>
              </div>
            </div>
          )}
          {!numServices && <p>You currently have no services in your cart.</p>}
        </div>
        <hr />
        {(numProducts > 0 || numServices > 0) && (
          <>
            <div className="mt-3 page">
              <p>
                Total : <strong>${total}</strong>{" "}
              </p>
            </div>
            <div className="mt-3 page">
              <Button className="btn btn-primary btn-lg" onClick={checkout}>
                Checkout
              </Button>
            </div>
            {cError && (
              <div className="alert alert-warning mb-3 mid mt-3" role="alert">
                Unable to checkout right now, please try again later.
              </div>
            )}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default CartPage;
