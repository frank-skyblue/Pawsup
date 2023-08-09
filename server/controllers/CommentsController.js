const express = require("express");
const { CommentModel } = require("../models/CommentModel");
// Base route: /api/comments
const CommentsController = express.Router();

// GET /api/comments
CommentsController.get("/", async (req, res) => {

  if (!req.query.comment_type || !req.query.foreign_id) {
    return res.status(400).json({
        message: "Fields are missing from request parameters. Must contain [comment_type, foreign_id]",
      });
  }

  try {
    const comments = await CommentModel.getComments(req.query.comment_type, req.query.foreign_id);
    res.json(comments.map((comment) => comment.cleanCopy()));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while fetching comments" });
  }
});

// POST /api/comments
CommentsController.post("/", async (req, res) => {
  const { comment_type, foreign_id, comment_detail, author_name, author_profile_pic_url, comment_time } = req.body;

  if (!comment_type || !foreign_id || !comment_detail || !author_name || !author_profile_pic_url || !comment_time) {
    return res.status(400).json({
      message: "Fields are missing from request body",
    });
  }

  const comment = new CommentModel({
    comment_type: comment_type,
    foreign_id: foreign_id,
    comment_detail: comment_detail,
    author_name: author_name,
    author_profile_pic_url: author_profile_pic_url,
    comment_time: comment_time,
  });

  try {
    await comment.insert();
    res.status(201).json(comment.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while creating comment" });
  }
});

// PUT /api/comments/:comment_id
CommentsController.put("/:comment_id", async (req, res) => {
  const { comment_id } = req.params;
  const { comment_type, foreign_id, comment_detail, author_name, author_profile_pic_url, comment_time } = req.body;

  if (!comment_type || !foreign_id || !comment_detail || !author_name || !author_profile_pic_url || !comment_time) {
    return res.status(400).json({
      message: "Fields are missing from request body",
    });
  }

  try {
    const comment = await CommentModel.getCommentByID(comment_id);
    if (!comment) {
      return res.status(404).json({
        message: `Comment with ID '${comment_id}' not found`,
      });
    }

    comment.comment_type = comment_type;
    comment.foreign_id = foreign_id;
    comment.comment_detail = comment_detail;
    comment.author_name = author_name;
    comment.author_profile_pic_url = author_profile_pic_url;
    comment.comment_time = comment_time;

    await comment.save();
    res.status(200).json(comment.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while updating comment" });
  }
});

// DELETE /api/comments/:comment_id
CommentsController.delete("/:comment_id", async (req, res) => {
  const { comment_id } = req.params;

  try {
    const comment = await CommentModel.getCommentByID(comment_id);
    if (!comment) {
      return res.status(404).json({
        message: `Comment with ID '${comment_id}' not found`,
      });
    }

    await comment.delete();
    res.status(200).json({ message: "Successfully deleted comment" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while deleting comment" });
  }
});

exports.CommentsController = CommentsController;
