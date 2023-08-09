import Footer from "../components/Footer";
import HeaderMenu from "../components/HeaderMenu";
import HomePageSearchService from "../components/HomePageSearchService";
import "./HomePage.css";
import safe from "../media/feature_safe.png";
import fast from "../media/feature_fast.png";
import guaranteed from "../media/feature_guaranteed.png";
import arranged from "../media/feature_arranged.png";
import { Container, Row, Col } from "react-bootstrap";
import React from "react";
import FeaturedServices from "../components/FeaturedServices.js";
import FeaturedProducts from "../components/FeaturedProducts.js";
const search = (e) => {};
const HomePage = () => {
  return (
    <>
      <HeaderMenu />
      <div className="homePage bg-light">
        <div className="container">
          <div className="row title-container text-center">
            <div className="title">
              <h1>Temporary Harbors, Warmth Like Home</h1>
            </div>
            <div className="subtitle">
              <h4>Best Pets Service platform, Solve your Every Worries</h4>
            </div>
          </div>
          <HomePageSearchService search={search} />
        </div>
      </div>
      <Container>
        <Row className="mb-2 text-center">
          <Col>
            <img src={safe} className="img-fluid rounded-circle" alt="Safe" />
            <h3>SAFE</h3>
            <h6 className="text-secondary">Certified Providers</h6>
          </Col>
          <Col>
            <img src={fast} className="img-fluid rounded-circle" alt="Fast" />
            <h3>FAST</h3>
            <h6 className="text-secondary">Easy as Browse-Book-Go</h6>
          </Col>
        </Row>
        <Row className="mb-2 text-center">
          <Col>
            <img
              src={guaranteed}
              className="img-fluid rounded-circle"
              alt="Guaranteed"
            />
            <h3>GUARANTEED</h3>
            <h6 className="text-secondary">Dependable & Reliable</h6>
          </Col>
          <Col>
            <img
              src={arranged}
              className="img-fluid rounded-circle"
              alt="Arranged"
            />
            <h3>ARRANGED</h3>
            <h6 className="text-secondary">A Variety of Services</h6>
          </Col>
        </Row>
      </Container>
      <FeaturedServices />
      <FeaturedProducts />
      <Footer />
    </>
  );
};

export default HomePage;
