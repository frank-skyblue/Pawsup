const { db } = require("../db/db");
const { DBModel } = require("./model");

class CommentModel extends DBModel {
  comment_id;
  comment_type;
  foreign_id;
  comment_detail;
  author_name;
  author_profile_pic_url;
  comment_time;

  constructor(data) {
    super({
      table: "comments",
      primaryKey: "comment_id",
    });
    Object.assign(this, data);
  }

  static async getComments(comment_type, foreign_id) {
    const data = await db.query("SELECT * FROM comments WHERE comment_type = $1 AND foreign_id = $2", [comment_type, foreign_id]);
    return data.map((row) => new CommentModel(row));
  }

  static async getCommentByID(comment_id) {
    const data = await db.query("SELECT * FROM comments WHERE comment_id = $1", [comment_id]);
    return data.length > 0 ? new CommentModel(data[0]) : null;
  }
}

exports.CommentModel = CommentModel;
