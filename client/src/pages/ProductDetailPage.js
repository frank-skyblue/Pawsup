import Footer from "../components/Footer";
import HeaderMenu from "../components/HeaderMenu";
import React, { useState, useEffect } from "react";
import { Image, Carousel, Button } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import "./ProductDetailPage.css";
import { QuantityPicker } from "react-qty-picker";
import CommentSection from "./../components/CommentSection";
import { useCartContext } from "../providers/CartProvider";
import axios from "axios";

const ProductDetailPage = ({ data }) => {
  const { userInfo, cartItems, setCartItems } = useCartContext();
  const [currentPrice, setCurrentPrice] = useState(data.product_price[0]);
  const [quant, setQuant] = useState(1);
  const [addedProductToCart, setAddedProductToCart] = useState(false);
  const [detailComments, setDetailComments] = useState({
    data: null,
    error: false,
  });

  const commentData = {
    comment_type: "product",
    foreign_id: data.product_id,
  };

  const getDetailComments = () => {
    axios
      .get(`/api/comments?comment_type=product&foreign_id=${data.product_id}`)
      .then((res) => {
        setDetailComments({
          data: res.data,
          error: false,
        });
      })
      .catch(() => setDetailComments({ error: true }));
  };

  const addProductToCart = () => {
    const sizeIndex = data.product_price.indexOf(currentPrice);
    axios
      .post("/api/cart/product", {
        product_id: data.product_id,
        quantity: quant,
        size: data.product_type[sizeIndex],
      })
      .then((response) => {
        setAddedProductToCart(true);
        setCartItems({
          ...cartItems,
          products: [...cartItems.products, { product_id: data.product_id }],
        });
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getDetailComments();
  }, [data.product_id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <HeaderMenu />
      <div className="container">
        <div className="row info">
          <div className="col-12 col-sm-4 productPicConatiner">
            <Carousel className="CarouselContainer">
              {data.product_pic_url &&
                data.product_pic_url.map((pic, i) => (
                  <Carousel.Item key={i}>
                    <Image
                      className="productImag"
                      style={{ objectFit: "cover" }}
                      src={`/api/images?image_name=${pic}`}
                      alt={i}
                      height="350vw"
                    />
                  </Carousel.Item>
                ))}
            </Carousel>
          </div>
          <div className="col-12 col-sm-6">
            <div className="productTitleContainter">
              <h2>{data.product_name}</h2>
              <p>
                by <strong>{data.product_origin}</strong>
              </p>
            </div>
            <div className="productForm">
              <div>
                <h2 className="productPrice">$ {currentPrice}</h2>
              </div>
              <div className="productRating">
                <p style={{ margin: "0px" }}>rating: </p>
                <ReactStars
                  count={5}
                  size={24}
                  activeColor="#ffd700"
                  value={Number(data.product_rating)}
                  isHalf={true}
                  edit={false}
                  emptyIcon={<i className="far fa-star"></i>}
                  halfIcon={<i className="fa fa-star-half-alt"></i>}
                  fullIcon={<i className="fa fa-star"></i>}
                />
              </div>
              <div className="productType">
                {data.product_type &&
                  data.product_type.map((size, i) => (
                    <Button
                      variant="outline-dark"
                      size="lg"
                      style={{ margin: "1rem" }}
                      onClick={() => setCurrentPrice(data.product_price[i])}
                      key={i}
                    >
                      {size}
                    </Button>
                  ))}
              </div>
              <div className="productQuant col-12">
                <QuantityPicker
                  className="quant-picker"
                  value={quant}
                  min={1}
                  max={10}
                  width="15rem"
                  onChange={(value) => {
                    setQuant(value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-2 purchase-details">
            <div className="d-grid gap-2">
              <Button
                disabled={!userInfo.isLoggedIn || addedProductToCart}
                variant="warning"
                size="lg"
                onClick={addProductToCart}
              >
                {!addedProductToCart ? "Add to Cart" : "Added to Cart"}
              </Button>
            </div>
          </div>
        </div>
        <div className="row detail">
          <h1>
            <strong>Description</strong>
          </h1>
          <p>{data.product_detail}</p>
        </div>
        <div className="col-12 comment">
          {detailComments.error && (
            <div className="alert comment-alert-warning" role="alert">
              Error while fetching comment, please try again later.
            </div>
          )}
          {!detailComments.error && (
            <CommentSection
              comments={detailComments.data}
              commentData={commentData}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
