const { db } = require("../db/db");
const { DBModel } = require("./model");

class ServiceCartItemModel extends DBModel {
  id;
  user_id;
  service_id;
  start_date;
  end_date;
  number_of_pets;

  constructor(data) {
    super({
      table: "service_cart_items",
      primaryKey: "id",
    });
    Object.assign(this, data);
  }

  static async getServiceCartItemsByUser(user_id) {
    const query = `SELECT * FROM service_cart_items sci
      LEFT JOIN services s ON sci.service_id = s.service_id
      WHERE sci.user_id = $1`;
    const params = [user_id];

    const data = await db.query(query, params);
    return data.map((row) => new ServiceCartItemModel(row));
  }

  static async deleteCartItemForUser(user_id, id) {
    const query = "DELETE FROM service_cart_items WHERE user_id = $1 AND id = $2";
    const params = [user_id, id];
    await db.query(query, params);
  }

  static async deleteAllCartItemsForUser(user_id) {
    const query = "DELETE FROM service_cart_items WHERE user_id = $1";
    const params = [user_id];
    await db.query(query, params);
  }
}

exports.ServiceCartItemModel = ServiceCartItemModel;
