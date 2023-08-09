const { db } = require("../db/db");
const { DBModel } = require("./model");

class ProductCartItemModel extends DBModel {
  id;
  user_id;
  product_id;
  quantity;
  size;

  constructor(data) {
    super({
      table: "product_cart_items",
      primaryKey: "id",
    });
    Object.assign(this, data);
  }

  static async getProductCartItemsByUser(user_id) {
    const query = `SELECT * FROM product_cart_items pci 
      LEFT JOIN products p ON pci.product_id = p.product_id 
      WHERE user_id = $1`;
    const params = [user_id];

    const data = await db.query(query, params);
    return data.map((row) => new ProductCartItemModel(row));
  }

  static async deleteCartItemForUser(user_id, id) {
    const query = "DELETE FROM product_cart_items WHERE user_id = $1 AND id = $2";
    const params = [user_id, id];
    await db.query(query, params);
  }

  static async deleteAllCartItemsForUser(user_id) {
    const query = "DELETE FROM product_cart_items WHERE user_id = $1";
    const params = [user_id];
    await db.query(query, params);
  }
}

exports.ProductCartItemModel = ProductCartItemModel;
