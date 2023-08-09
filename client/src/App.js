import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SigninPage from "./pages/SigninPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import ServicePage from "./pages/ServicePage";
import ProductPage from "./pages/ProductPage";
import MediaPage from "./pages/MediaPage";
import AccountPage from "./pages/AccountPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import MediaDetailPage from "./pages/MediaDetailPage";
import CreateMedia from "./pages/CreateMedia";
import CreateService from "./pages/CreateService";
import CartPage from "./pages/CartPage";
import CheckoutCompletePage from "./pages/CheckoutCompletePage";
import notFoundPage from "./pages/notFoundPage";

import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [detailProducts, setDetailProducts] = useState({
    data: null,
    error: false,
  });
  const [detailService, setDetailServices] = useState({
    data: null,
    error: false,
  });
  const [detailMedia, setDetailMedia] = useState({ data: null, error: false });

  const getDetailProducts = () => {
    axios
      .get("/api/products")
      .then((res) => {
        setDetailProducts({
          data: res.data,
          error: false,
        });
      })
      .catch(() => setDetailProducts({ error: true }));
  };

  const getDetailServices = () => {
    axios
      .get("/api/services")
      .then((res) => {
        setDetailServices({
          data: res.data,
          error: false,
        });
      })
      .catch(() => setDetailServices({ error: true }));
  };

  const getDetailMedia = () => {
    axios
      .get("/api/mediapages")
      .then((res) => {
        setDetailMedia({
          data: res.data,
          error: false,
        });
      })
      .catch(() => setDetailMedia({ error: true }));
  };
  useEffect(() => {
    getDetailProducts();
    getDetailServices();
    getDetailMedia();
  }, []);

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/signin" component={SigninPage} />
          <Route exact path="/signup" component={SignupPage} />
          <Route exact path="/service" component={ServicePage} />
          <Route exact path="/product" component={ProductPage} />
          <Route exact path="/media" component={MediaPage} />
          <Route exact path="/realaccountpage" component={AccountPage} />
          <Route exact path="/CreateMedia" component={CreateMedia} />
          <Route exact path="/CreateService" component={CreateService} />
          <Route exact path="/cart" component={CartPage} />
          <Route exact path="/cart/checkout" component={CheckoutCompletePage} />

          {detailProducts.data &&
            detailProducts.data.map((productDetailed) => (
              <Route
                exact
                path={`/product/p${productDetailed.product_id}`}
                key={`p${productDetailed.product_id}`}
              >
                <ProductDetailPage data={productDetailed} />
              </Route>
            ))}
          {detailService.data &&
            detailService.data.map((serviceDetailed) => (
              <Route
                exact
                path={`/service/s${serviceDetailed.service_id}`}
                key={`s${serviceDetailed.service_id}`}
              >
                <ServiceDetailPage data={serviceDetailed} />
              </Route>
            ))}
          {detailMedia.data &&
            detailMedia.data.map((mediaDetailed) => (
              <Route
                exact
                path={`/media/m${mediaDetailed.id}`}
                key={`m${mediaDetailed.id}`}
              >
                <MediaDetailPage data={mediaDetailed} />
              </Route>
            ))}
          {detailMedia.data && <Route component={notFoundPage} />}
        </Switch>
      </div>
      <div>
        {detailProducts.error && (
          <div className="alert product-alert-warning" role="alert">
            Error while fetching products, please try again later.
          </div>
        )}
        {detailService.error && (
          <div className="alert service-alert-warning" role="alert">
            Error while fetching service, please try again later.
          </div>
        )}
        {detailMedia.error && (
          <div className="alert media-alert-warning" role="alert">
            Error while fetching media, please try again later.
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
