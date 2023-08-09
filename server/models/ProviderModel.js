const { db } = require("../db/db");
const { DBModel } = require("./model");

class ProviderModel extends DBModel {
  provider_id;
  provider_name;
  provider_phone;
  provider_email;
  provider_avatar;

  constructor(data) {
    super({
      table: "providers",
      primaryKey: "provider_id",
    });
    Object.assign(this, data);
  }

  static async getProviders() {
    const data = await db.query("SELECT * FROM providers");
    return data.map((row) => new ProviderModel(row));
}

  static async getProviderByID(provider_id) {
    const data = await db.query("SELECT * FROM providers WHERE provider_id = $1", [provider_id]);
    return data.length > 0 ? new ProviderModel(data[0]) : null;
  }
}

exports.ProviderModel = ProviderModel;
