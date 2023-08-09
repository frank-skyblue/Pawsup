const express = require("express");
const { CommentModel } = require("../models/CommentModel");
const { ReplyModel } = require("../models/ReplyModel");
// Base route: /api/replies
const RepliesController = express.Router();

// GET /api/replies
RepliesController.get("/", async (req, res) => {
  try {
    if (!req.query.cid) {
        const replies = await ReplyModel.getReplies();
        res.json(replies.map((reply) => reply.cleanCopy()));
    } else {
        const commentExists = await CommentModel.getCommentByID(req.query.cid);
        if (commentExists) {
            const replies = await ReplyModel.getRepliesFromComment(req.query.cid);
            res.json(replies.map((reply) => reply.cleanCopy()));
        } else {
            res.json({ message: "Comment does not exist."});
        }
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while fetching replies" });
  }
});

//GET /api/replies/:reply_id
RepliesController.get("/:reply_id", async (req, res) => {
    const { reply_id } = req.params;
  
    try {
      const reply = await ReplyModel.getReplyByID(reply_id);
      if (!reply) {
        return res.status(404).json({
          message: `Reply with ID '${reply_id}' not found`,
        });
      }
      res.status(200).json(reply.cleanCopy());
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Encountered an error while fetching reply" });
    }
  });

// POST /api/replies
RepliesController.post("/", async (req, res) => {
  const { cid, reply_username, reply_avatar_url, reply_detail, reply_time } = req.body;

  if (!cid || !reply_username || !reply_avatar_url || !reply_detail || !reply_time) {
    return res.status(400).json({
      message: "Fields are missing from request body",
    });
  }

  const reply = new ReplyModel({
    cid: cid,
    reply_username: reply_username,
    reply_avatar_url: reply_avatar_url,
    reply_detail: reply_detail,
    reply_time: reply_time,
  });

  try {
    await reply.insert();
    res.status(201).json(reply.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while creating reply" });
  }
});

// PUT /api/replies/:reply_id
RepliesController.put("/:reply_id", async (req, res) => {
  const { reply_id } = req.params;
  const { cid, reply_username, reply_avatar_url, reply_detail, reply_time } = req.body;

  if (!cid && !reply_username && !reply_avatar_url && !reply_detail && !reply_time) {
    return res.status(400).json({
      message: "Fields are missing from request body. Nothing to change!",
    });
  }

  try {
    const reply = await ReplyModel.getReplyByID(reply_id);
    if (!reply) {
      return res.status(404).json({
        message: `Reply with ID '${reply_id}' not found`,
      });
    }

    if (cid) {
        reply.cid = cid;
    }
    
    if (reply_username) {
        reply.reply_username = reply_username;
    }
    
    if (reply_avatar_url) {
        reply.reply_avatar_url = reply_avatar_url;
    }
    
    if (reply_detail) {
        reply.reply_detail = reply_detail;
    }
    
    if (reply_time) {
        reply.reply_time = reply_time;
    }

    await reply.save();
    res.status(200).json(reply.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while updating reply" });
  }
});

// DELETE /api/replies/:reply_id
RepliesController.delete("/:reply_id", async (req, res) => {
  const { reply_id } = req.params;

  try {
    const reply = await ReplyModel.getReplyByID(reply_id);
    if (!reply) {
      return res.status(404).json({
        message: `Reply with ID '${reply_id}' not found`,
      });
    }

    await reply.delete();
    res.status(200).json({ message: "Successfully deleted reply" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while deleting reply" });
  }
});

exports.RepliesController = RepliesController;
