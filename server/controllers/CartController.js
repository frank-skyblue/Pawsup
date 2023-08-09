const express = require("express");
const { ProductCartItemModel } = require("../models/ProductCartItemModel");
const { ServiceCartItemModel } = require("../models/ServiceCartItemModel");
// Base route: /api/cart
const CartController = express.Router();

// GET /api/cart
CartController.get("/", async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Please login to access this endpoint" });
    }
  
    const { uid } = req.user;
    const product_cart_items = (await ProductCartItemModel.getProductCartItemsByUser(uid))
      .map((row) => row.cleanCopy());
    const service_cart_items = (await ServiceCartItemModel.getServiceCartItemsByUser(uid))
      .map((row) => row.cleanCopy());
  
    res.json({
      products: product_cart_items,
      services: service_cart_items,
    });
  } catch(err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while fetching data" });
  }
});

// POST /api/cart/product
CartController.post("/product", async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Please login to access this endpoint" });
    }
    const { uid } = req.user;
    const { product_id, quantity, size } = req.body;
    const productCartItem = new ProductCartItemModel({
      user_id: uid,
      product_id: product_id,
      quantity: quantity,
      size: size,
    })
    await productCartItem.insert();
    
    res.json({ message: "Successfully added product to cart." })
  } catch(err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while inserting data" });
  }
});

// POST /api/cart/service
CartController.post("/service", async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Please login to access this endpoint" });
    }
    const { uid } = req.user;
    const { service_id, start_date, end_date, number_of_pets } = req.body;
    const serviceCartItem = new ServiceCartItemModel({
      user_id: uid,
      service_id: service_id,
      start_date: start_date,
      end_date: end_date,
      number_of_pets: number_of_pets,
    })
    await serviceCartItem.insert();
    
    res.json({ message: "Successfully added service to cart." })
  } catch(err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while inserting data" });
  }
});

// DELETE /api/cart/product/:id
CartController.delete("/product/:id", async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Please login to access this endpoint" });
    }
    const { uid } = req.user;
    const product_cart_item_id = req.params.id;
    await ProductCartItemModel.deleteCartItemForUser(uid, product_cart_item_id);
    
    res.json({ message: "Successfully deleted item from cart" });
  } catch(err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while deleting data" });
  }
});

// DELETE /api/cart/service/:id
CartController.delete("/service/:id", async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Please login to access this endpoint" });
    }
    const { uid } = req.user;
    const service_cart_item_id = req.params.id;
    await ServiceCartItemModel.deleteCartItemForUser(uid, service_cart_item_id);
    
    res.json({ message: "Successfully deleted item from cart" });
  } catch(err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while deleting data" });
  }
});

// DELETE /api/cart
CartController.delete("/", async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Please login to access this endpoint" });
    }
    const { uid } = req.user;
    await ServiceCartItemModel.deleteAllCartItemsForUser(uid);
    await ProductCartItemModel.deleteAllCartItemsForUser(uid);

    res.json({ message: "Successfully emptied the user's cart" });
  } catch(err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while deleting data" });
  }
});

exports.CartController = CartController;
