const { Pool } = require("pg");
const { config } = require("../config/config");

class DB {
  constructor() {
    if (!DB.instance) {
      DB.instance = this;

      this.pool = new Pool({
        user: config.dbUser,
        password: config.dbPass,
        host: config.dbHost,
        port: config.dbPort,
        database: config.dbName,
      });
    }

    return DB.instance;
  }

  async query(statement, params = []) {
    let client;
    try {
      client = await this.pool.connect();
      const res = await client.query(statement, params);
      return res.rows;
    } catch (err) {
      console.error({ message: "Error while querying database", err });
      throw err;
    } finally {
      if (client) client.release();
    }
  }
}

const db = new DB();
Object.freeze(db);

exports.db = db;
