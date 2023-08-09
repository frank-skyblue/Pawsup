const express = require("express");
const { ServiceModel } = require("../models/ServiceModel");
// Base route: /api/services
const ServicesController = express.Router();

// GET /api/services
ServicesController.get("/", async (req, res) => {
  try {
    // Optional filtering and sorting parameters for getting services
    let { locations = "", pet_breeds = "", minPrice, maxPrice, sortBy, sortDirection } = req.query;
    locations = locations.split(",").filter(item => item);
    pet_breeds = pet_breeds.split(",").filter(item => item);

    const services = await ServiceModel.getServices(locations, pet_breeds, minPrice, maxPrice, sortBy, sortDirection);
    res.json(services.map((service) => service.cleanCopy()));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while fetching services" });
  }
});

//GET /api/services/:service_id
ServicesController.get("/:service_id", async (req, res) => {
  const { service_id } = req.params;

  try {
    const service = await ServiceModel.getServiceByID(service_id);
    if (!service) {
      return res.status(404).json({
        message: `Service with ID '${service_id}' not found`,
      });
    }
    res.status(200).json(service.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while fetching services" });
  }
});

//GET /api/services/for_user/:user_id
ServicesController.get("/for_user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const services = await ServiceModel.getServicesByUser(user_id);
    if (!services) {
      return res.status(404).json({
        message: `No services for user '${user_id}' `,
      });
    }
    res.json(services.map((service) => service.cleanCopy()));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while fetching services" });
  }
});

// POST /api/services
ServicesController.post("/", async (req, res) => {
  const { service_pic_url, service_title, service_detail, service_facility, location, price_per_day, service_rating, service_pet_breed, user_id } = req.body;

  if (!service_pic_url || !service_title || !service_detail || !service_facility || !location || !price_per_day || !service_rating || !service_pet_breed || !user_id) {
    return res.status(400).json({
      message: "Fields are missing from request body",
    });
  }

  const service = new ServiceModel({
    service_pic_url: service_pic_url,
    service_title: service_title,
    service_detail: service_detail,
    service_facility: service_facility,
    location: location,
    price_per_day: price_per_day,
    service_rating: service_rating,
    service_pet_breed: service_pet_breed,
    user_id: user_id,
  });

  try {
    await service.insert();
    res.status(201).json(service.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while creating service" });
  }
});

// PUT /api/services/:service_id
ServicesController.put("/:service_id", async (req, res) => {
  const { service_id } = req.params;
  const { service_pic_url, service_title, service_detail, service_facility, location, price_per_day, service_rating, service_pet_breed, user_id} = req.body;

  if (!service_pic_url && !service_title && !service_detail && !service_facility && !location && !price_per_day && !service_rating && !service_pet_breed && !user_id) {
    return res.status(400).json({
      message: "Fields are missing from request body. Nothing to edit!",
    });
  }

  try {
    const service = await ServiceModel.getServiceByID(service_id);
    if (!service) {
      return res.status(404).json({
        message: `Service with ID '${service_id}' not found`,
      });
    }

    if (service_pic_url) {
      service.service_pic_url = service_pic_url;
    }
    
    if (service_title) {
      service.service_title = service_title;
    }
    
    if (service_detail) {
      service.service_detail = service_detail;
    }

    if (service_facility) {
      service.service_facility = service_facility;
    }
    
    if (location) {
      service.location = location;
    }
    
    if (price_per_day) {
      service.price_per_day = price_per_day;
    }

    if (service_rating) {
      service.service_rating = service_rating;
    }

    if (service_pet_breed) {
      service.service_pet_breed = service_pet_breed;
    }

    if (user_id) {
      service.user_id = user_id;
    }
    
    await service.save();
    res.status(200).json(service.cleanCopy());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while updating service" });
  }
});

// DELETE /api/services/:service_id
ServicesController.delete("/:service_id", async (req, res) => {
  const { service_id } = req.params;

  try {
    const service = await ServiceModel.getServiceByID(service_id);
    if (!service) {
      return res.status(404).json({
        message: `Service with ID '${service_id}' not found`,
      });
    }

    await service.delete();
    res.status(200).json({ message: "Successfully deleted service" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Encountered an error while deleting service" });
  }
});

exports.ServicesController = ServicesController;
