const express = require("express");
const { ProviderModel } = require("../models/ProviderModel");
// Base route: /api/providers
const ProvidersController = express.Router();

// GET /api/providers
ProvidersController.get("/", async (req, res) => {
  try {
    const providers = await ProviderModel.getProviders();
    res.json(providers.map((provider) => provider.cleanCopy()));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while fetching providers" });
  }
});

//GET /api/providers/:provider_id
ProvidersController.get("/:provider_id", async (req, res) => {
    const { provider_id } = req.params;
  
    try {
      const provider = await ProviderModel.getProviderByID(provider_id);
      if (!provider) {
        return res.status(404).json({
          message: `Provider with ID '${provider_id}' not found`,
        });
      }
      res.status(200).json(provider.cleanCopy());
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Encountered an error while fetching provider" });
    }
  });

// POST /api/providers
ProvidersController.post("/", async (req, res) => {
  const { provider_name, provider_phone, provider_email, provider_avatar } = req.body;

  if (!provider_name || !provider_phone || !provider_email || !provider_avatar) {
    return res.status(400).json({
      message: "Fields are missing from request body",
    });
  }

  const provider = new ProviderModel({
    provider_name: provider_name,
    provider_phone: provider_phone,
    provider_email: provider_email,
    provider_avatar: provider_avatar,
  });

  try {
    await provider.insert();
    res.status(201).json(provider.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while creating provider" });
  }
});

// PUT /api/providers/:provider_id
ProvidersController.put("/:provider_id", async (req, res) => {
  const { provider_id } = req.params;
  const { provider_name, provider_phone, provider_email, provider_avatar } = req.body;

  if (!provider_name && !provider_phone && !provider_email && !provider_avatar) {
    return res.status(400).json({
      message: "Fields are missing from request body. Nothing to change!",
    });
  }

  try {
    const provider = await ProviderModel.getProviderByID(provider_id);
    if (!provider) {
      return res.status(404).json({
        message: `Provider with ID '${provider_id}' not found`,
      });
    }

    if (provider_name) {
        provider.provider_name = provider_name;
    }
    
    if (provider_phone) {
        provider.provider_phone = provider_phone;
    }
    
    if (provider_email) {
        provider.provider_email = provider_email;
    }
    
    if (provider_avatar) {
        provider.provider_avatar = provider_avatar;
    }
    
    await provider.save();
    res.status(200).json(provider.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while updating provider" });
  }
});

// DELETE /api/providers/:provider_id
ProvidersController.delete("/:provider_id", async (req, res) => {
  const { provider_id } = req.params;

  try {
    const provider = await ProviderModel.getProviderByID(provider_id);
    if (!provider) {
      return res.status(404).json({
        message: `Provider with ID '${provider_id}' not found`,
      });
    }

    await provider.delete();
    res.status(200).json({ message: "Successfully deleted provider" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while deleting provider" });
  }
});

exports.ProvidersController = ProvidersController;
