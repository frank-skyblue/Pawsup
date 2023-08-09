const { db } = require("../db/db");
const { DBModel } = require("./model");

class ImageModel extends DBModel {
  image_id;
  image_name;
  image_data;

  constructor(data) {
    super({
      table: "images",
      primaryKey: "image_id",
    });
    Object.assign(this, data);
  }

  static async getImageByID(image_id) {
    const data = await db.query("SELECT * FROM images WHERE image_id = $1", [image_id]);
    return data.length > 0 ? new ImageModel(data[0]) : null;
  }

  static async getImageByName(image_name) {
    const data = await db.query("SELECT * FROM images WHERE image_name = $1", [image_name]);
    return data.length > 0 ? new ImageModel(data[0]) : null;
  }
}

exports.ImageModel = ImageModel;
