const { db } = require("../db/db");
const { DBModel } = require("./model");

class ProductModel extends DBModel {
  product_id;
  product_name;
  product_detail;
  product_origin;
  product_category;
  product_pet_breed;
  product_type;
  product_pic_url;
  product_price;
  product_rating;

  constructor(data) {
    super({
      table: "products",
      primaryKey: "product_id",
    });
    Object.assign(this, data);
  }

  static async getProducts(categories, pet_breeds, minPrice, maxPrice, sortBy, sortDirection = "ASC") {
    let query = "SELECT * FROM products";
    const params = [];

    // Apply optional filters to query if they are specified
    if (categories.length > 0 || pet_breeds.length > 0 || (minPrice != null) || (maxPrice != null)) {
      query += " WHERE";

      if (categories.length > 0) {
        query += ` product_category IN (`;
        for (const category of categories) {
          params.push(category);
          query += `$${params.length},`;
        }
        query = query.slice(0, -1);
        query += ") AND";
      }

      if (pet_breeds.length > 0) {
        query += ` product_pet_breed IN (`;
        for (const pet_breed of pet_breeds) {
          params.push(pet_breed);
          query += `$${params.length},`;          
        }
        query = query.slice(0, -1);
        query += ") AND";
      }

      // Remove the trailing " AND";
      query = query.slice(0, -4);
    }

    // Apply the sorting direction if specified
    const validSortColumns = ["product_price", "product_rating"];
    if (validSortColumns.includes(sortBy?.toLowerCase())) {
      if (sortDirection !== "ASC") {
        sortDirection = "DESC";
      }

      query += ` ORDER BY ${sortBy} ${sortDirection}`;
    } else {
      query += ` ORDER BY product_id`;
    }

    let data = await db.query(query, params);

    data = data.filter((row) => {
      let satisfiesMinPrice = true;
      let satisfiesMaxPrice = true;
      if (minPrice != null) {
        satisfiesMinPrice = false;
        row.product_price.forEach((price) => {
          if (price >= minPrice) {
            satisfiesMinPrice = true;
          }
        });
      }
      if (maxPrice != null) {
        satisfiesMaxPrice = false;
        row.product_price.forEach((price) => {
          if (price <= maxPrice) {
            satisfiesMaxPrice = true;
          }
        });
      }
      return satisfiesMinPrice && satisfiesMaxPrice;
    });
    return data.map((row) => new ProductModel(row));
  }

  static async getProductByID(product_id) {
    const data = await db.query("SELECT * FROM products WHERE product_id = $1", [product_id]);
    return data.length > 0 ? new ProductModel(data[0]) : null;
  }
}

exports.ProductModel = ProductModel;
