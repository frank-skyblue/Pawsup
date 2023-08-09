const { db } = require("../db/db");
const { DBModel } = require("./model");

class UserModel extends DBModel {
    uid;
    username;
    email;
    password;
    fname;
    lname;
    city;
    phone_number;
    avatar;
    is_service_provider;

    constructor(data) {
        super({
            table: "users",
            primaryKey: "uid",
        })
        Object.assign(this, data);
    }

    static async getUsers() {
        const data = await db.query("SELECT * FROM users");
        return data.map((row) => new UserModel(row));
    }
    
    static async getUserByID(uid) {
        const data = await db.query("SELECT * FROM users WHERE uid = $1", [uid]);
        return data.length > 0 ? new UserModel(data[0]) : null;
    }

    static async getUserByUsername(username) {
        const data = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        return data.length > 0 ? new UserModel(data[0]) : null;
    }
}

exports.UserModel = UserModel;