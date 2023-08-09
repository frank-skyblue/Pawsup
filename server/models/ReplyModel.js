const { db } = require("../db/db");
const { DBModel } = require("./model");

class ReplyModel extends DBModel {
  reply_id;
  cid;
  reply_username;
  reply_avatar_url;
  reply_detail;
  reply_time;

  constructor(data) {
    super({
      table: "replies",
      primaryKey: "reply_id",
    });
    Object.assign(this, data);
  }

  static async getReplies() {
    const data = await db.query("SELECT * FROM replies");
    return data.map((row) => new ReplyModel(row));
}

  static async getReplyByID(reply_id) {
    const data = await db.query("SELECT * FROM replies WHERE reply_id = $1", [reply_id]);
    return data.length > 0 ? new ReplyModel(data[0]) : null;
  }

  static async getRepliesFromComment(cid) {
    const data = await db.query("SELECT * FROM replies WHERE cid = $1", [cid]);
    return data.map((row) => new ReplyModel(row));
  }
}

exports.ReplyModel = ReplyModel;
