import HeaderMenu from "../components/HeaderMenu";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import EditAccountPage from "../components/EditAccountPage";
import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import "./AccountPage.css";
import ShowPostedServices from "../components/ShowPostedServices";
import ShowPostedMedia from "../components/ShowPostedMedia";
import axios from "axios";
import { Spinner } from "react-bootstrap";
const AccountPage = () => {
  const [status, setStatus] = useState({ isLoggedIn: false, user: null });
  const [loading, setLoading] = useState(true);
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

  return (
    <>
      <HeaderMenu />
      {loading ? (
        <div className="page">
          <Spinner animation="grow" variant="primary" />
          <p>Loading...</p>
        </div>
      ) : status.isLoggedIn ? (
        <Container className="pt-5 pb-3 accountPg">
          <Tabs defaultActiveKey="services" id="accountPG" className="">
            <Tab eventKey="services" title="Services">
              <ShowPostedServices data={status.user} />
            </Tab>
            <Tab eventKey="social" title="Social">
              <ShowPostedMedia data={status.user} />
            </Tab>
            <Tab eventKey="editAccount" title="Edit Account">
              <EditAccountPage />
            </Tab>
          </Tabs>
        </Container>
      ) : (
        (window.location = "/signin")
      )}

      <Footer />
    </>
  );
};

export default AccountPage;
