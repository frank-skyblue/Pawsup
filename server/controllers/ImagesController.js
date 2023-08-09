const express = require("express");
const { ImageModel } = require("../models/ImageModel");
// Base route: /api/images
const ImagesController = express.Router();

// GET /api/images
ImagesController.get("/", async (req, res) => {
  if (!req.query.image_name) {
    return res.status(400).json({
        message: "Image name is missing from request parameters.",
      });
  }

  try {
    const image = await ImageModel.getImageByName(req.query.image_name);
    if (!image) {
      return res.status(404).json({
        message: `Image with name '${req.query.image_name}' not found`,
      });
    }
    res.status(200).end(image.image_data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while fetching image" });
  }
});

//GET /api/images/:image_id
ImagesController.get("/:image_id", async (req, res) => {
    const { image_id } = req.params;
  
    try {
      const image = await ImageModel.getImageByID(image_id);
      if (!image) {
        return res.status(404).json({
          message: `Image with ID '${image_id}' not found`,
        });
      }
      res.status(200).end(image.image_data);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Encountered an error while fetching image" });
    }
  });

// POST /api/images
ImagesController.post("/", async (req, res) => {
  const { name, data } = req.files.img;

  if (!name || !data) {
    return res.status(400).json({
      message: "Image is missing from the form",
    });
  }

  const image = new ImageModel({
    image_name: name,
    image_data: data,
  });

  try {
    await image.insert();
    res.status(201).json(image.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while creating image" });
  }
});

// DELETE /api/images/:image_id
ImagesController.delete("/:image_id", async (req, res) => {
  const { image_id } = req.params;

  try {
    const image = await ImageModel.getImageByID(image_id);
    if (!image) {
      return res.status(404).json({
        message: `image with ID '${image_id}' not found`,
      });
    }

    await image.delete();
    res.status(200).json({ message: "Successfully deleted image" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while deleting image" });
  }
});

exports.ImagesController = ImagesController;
