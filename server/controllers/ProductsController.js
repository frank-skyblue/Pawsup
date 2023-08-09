const express = require("express");
const { ProductModel } = require("../models/ProductModel");
// Base route: /api/products
const ProductsController = express.Router();

// GET /api/products
ProductsController.get("/", async (req, res) => {
  try {
    // Optional filtering and sorting parameters for getting products
    let { categories = "", pet_breeds = "", minPrice, maxPrice, sortBy, sortDirection } = req.query;
    categories = categories.split(",").filter(item => item);
    pet_breeds = pet_breeds.split(",").filter(item => item);

    const products = await ProductModel.getProducts(categories, pet_breeds, minPrice, maxPrice, sortBy, sortDirection);
    res.json(products.map((product) => product.cleanCopy()));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while fetching products" });
  }
});

//GET /api/products/:product_id
ProductsController.get("/:product_id", async (req, res) => {
  const { product_id } = req.params;

  try {
    const product = await ProductModel.getProductByID(product_id);
    if (!product) {
      return res.status(404).json({
        message: `Product with ID '${product_id}' not found`,
      });
    }
    res.status(200).json(product.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while fetching products" });
  }
});

// POST /api/products
ProductsController.post("/", async (req, res) => {
  const { product_detail, product_name, product_origin, product_category, product_pet_breed, product_price, product_type, product_pic_url, product_rating } = req.body;

  if (!product_detail || !product_name || !product_origin || !product_price || !product_type || !product_pic_url || !product_rating) {
    return res.status(400).json({
      message: "Fields are missing from request body",
    });
  }

  const product = new ProductModel({
    product_detail: product_detail,
    product_name: product_name,
    product_origin: product_origin,
    product_price: product_price,
    product_type: product_type,
    product_pic_url: product_pic_url,
    product_rating: product_rating,
    product_category: product_category,
    product_pet_breed: product_pet_breed,
  });

  try {
    await product.insert();
    res.status(201).json(product.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while creating product" });
  }
});

// PUT /api/products/:product_id
ProductsController.put("/:product_id", async (req, res) => {
  const { product_id } = req.params;
  const { product_detail, product_name, product_origin, product_category, product_pet_breed, product_price, product_type, product_pic_url, product_rating } = req.body;

  if (!product_detail && !product_name && !product_origin && !product_category && !product_pet_breed && !product_price && !product_type && !product_pic_url && !product_rating) {
    return res.status(400).json({
      message: "Fields are missing from request body. Nothing to change!",
    });
  }

  try {
    const product = await ProductModel.getProductByID(product_id);
    if (!product) {
      return res.status(404).json({
        message: `Product with ID '${product_id}' not found`,
      });
    }

    if (product_detail) {
      product.product_detail = product_detail;
    }
    
    if (product_name) {
      product.product_name = product_name;
    }

    if (product_origin) {
      product.product_origin = product_origin;
    }

    if (product_price) {
      product.product_price = product_price;
    }
    
    if (product_type) {
      product.product_type = product_type;
    }
    
    if (product_pic_url) {
      product.product_pic_url = product_pic_url;
    }
    
    if (product_rating) {
      product.product_rating = product_rating;
    }
    
    if (product_category) {
      product.product_category = product_category;
    }
    
    if (product_pet_breed) {
      product.product_pet_breed = product_pet_breed;
    }
    
    await product.save();
    res.status(200).json(product.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while updating product" });
  }
});

// DELETE /api/products/:product_id
ProductsController.delete("/:product_id", async (req, res) => {
  const { product_id } = req.params;

  try {
    const product = await ProductModel.getProductByID(product_id);
    if (!product) {
      return res.status(404).json({
        message: `Product with ID '${product_id}' not found`,
      });
    }

    await product.delete();
    res.status(200).json({ message: "Successfully deleted product" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while deleting product" });
  }
});

exports.ProductsController = ProductsController;
