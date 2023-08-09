const { db } = require("../db/db");

class DBModel {
  _properties;
  constructor(properties) {
    if (!properties) {
      throw new Error(
        `Missing '_properties' in constructor for model '${this.constructor.name}''`
      );
    }

    const missingProperties = [];

    if (!properties.table) {
      missingProperties.push("table");
    }

    if (!properties.primaryKey) {
      missingProperties.push("primaryKey");
    }

    if (missingProperties.length > 0) {
      throw new Error(
        `Missing [${missingProperties.join(
          ", "
        )}] from '_properties' in constructor for model ${
          this.constructor.name
        }`
      );
    }

    this._properties = properties;
  }

  // Insert the model instance into the DB, and add primary key to the model instance
  async insert() {
    const { table, primaryKey } = this._properties;
    const columns = [];
    const parameters = [];
    const values = [];

    for (const [column, value] of Object.entries(this)) {
      // Skip private variables (e.g. _properties)
      if (column[0] === "_") continue;
      if (column === primaryKey) continue;

      columns.push(column);
      parameters.push(`$${parameters.length + 1}`);
      values.push(value);
    }

    const query = `INSERT INTO ${table} 
      (${columns.join(", ")}) 
      VALUES (${parameters.join(", ")}) RETURNING *`;

    const result = (await db.query(query, values))[0];
    // Add the primary key to the model instance, since before insertion, it did not have a value for primary key
    Object.assign(this, result);
  }

  // Update the model instance in the DB, based on its primary key
  async save() {
    const { table, primaryKey } = this._properties;
    const colsAndParams = [];
    const values = [];

    for (const [column, value] of Object.entries(this)) {
      // Skip private variables (e.g. _properties)
      if (column[0] === "_") continue;
      if (column === primaryKey) continue;

      colsAndParams.push(`${column} = $${colsAndParams.length + 1}`);
      values.push(value);
    }

    const query = `UPDATE ${table} 
      SET ${colsAndParams.join(", ")} 
      WHERE ${primaryKey} = $${colsAndParams.length + 1}`;
    values.push(this[primaryKey]);

    await db.query(query, values);
  }

  // Delete the model instance from the DB, based on its primary key
  async delete() {
    const { table, primaryKey } = this._properties;

    const query = `DELETE FROM ${table} WHERE ${primaryKey} = $1`;
    const values = [this[primaryKey]];

    await db.query(query, values);
  }

  // Return an object copy of the model, without any private variables
  cleanCopy() {
    const obj = {};

    for (const [key, value] of Object.entries(this)) {
      if (key[0] === "_") continue;
      obj[key] = value;
    }

    return obj;
  }
}

exports.DBModel = DBModel;
