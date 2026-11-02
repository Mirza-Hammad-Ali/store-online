
const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product");

const {
  authenticate,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Convert MongoDB product into frontend format
function formatProduct(product) {
  const images = product.images || [];

  return {
    id: product._id.toString(),
    name: product.name,
    category: product.category,
    price: product.price,
    tag: product.tag || "",
    images,
    image: images[0] || "",
    description: product.description,
    stock: product.stock,
    status: product.status,
  };
}

// GET all active products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ status: "active" })
      .sort({ createdAt: -1 });

    res.json({ products: products.map(formatProduct) });
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ message: "Unable to fetch products." });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      status: "active",
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({ product: formatProduct(product) });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Unable to fetch product." });
  }
});

// ADD product - Admin only
router.post("/", authenticate, adminOnly, async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      tag,
      images,
      image,
      description,
      stock,
      status,
    } = req.body;

    // Support both new images array and old image string
    const productImages = Array.isArray(images)
      ? images
      : typeof image === "string"
        ? [image]
        : [];

    if (
      typeof name !== "string" ||
      !name.trim() ||
      !["Wearables", "Accessories", "Living"].includes(category) ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !productImages.length ||
      productImages.some(
        (url) => typeof url !== "string" || !url.trim() || url.length > 2048
      ) ||
      typeof description !== "string" ||
      !description.trim() ||
      (tag !== undefined && typeof tag !== "string") ||
      (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) ||
      (status !== undefined && !["active", "draft", "out_of_stock"].includes(status))
    ) {
      return res.status(400).json({
        message: "Please provide valid product details, including image and description.",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      category,
      price,
      tag: tag || "",
      images: productImages.map((url) => url.trim()),
      description: description.trim(),
      stock: stock ?? 0,
      status: status || "active",
    });

    res.status(201).json({
      message: "Product added successfully.",
      product: formatProduct(product),
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({
      message: error.message || "Unable to add product.",
    });
  }
});

// UPDATE product - Admin only
router.put("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const allowedFields = [
      "name",
      "category",
      "price",
      "tag",
      "images",
      "image",
      "description",
      "stock",
      "status",
    ];

    const updates = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    // Convert old image string into images array
    if (updates.image !== undefined && updates.images === undefined) {
      updates.images = [updates.image];
    }

    delete updates.image;

    if (
      Object.keys(updates).length === 0 ||
      (updates.name !== undefined &&
        (typeof updates.name !== "string" || !updates.name.trim())) ||
      (updates.category !== undefined &&
        !["Wearables", "Accessories", "Living"].includes(updates.category)) ||
      (updates.price !== undefined &&
        (typeof updates.price !== "number" ||
          !Number.isFinite(updates.price) ||
          updates.price < 0)) ||
      (updates.tag !== undefined && typeof updates.tag !== "string") ||
      (updates.images !== undefined &&
        (!Array.isArray(updates.images) ||
          updates.images.length === 0 ||
          updates.images.some(
            (url) => typeof url !== "string" || !url.trim() || url.length > 2048
          ))) ||
      (updates.description !== undefined &&
        (typeof updates.description !== "string" || !updates.description.trim())) ||
      (updates.stock !== undefined &&
        (!Number.isInteger(updates.stock) || updates.stock < 0)) ||
      (updates.status !== undefined &&
        !["active", "draft", "out_of_stock"].includes(updates.status))
    ) {
      return res.status(400).json({ message: "Invalid product updates." });
    }

    if (updates.name) updates.name = updates.name.trim();

    if (updates.images) {
      updates.images = updates.images.map((url) => url.trim());
    }

    if (updates.description) {
      updates.description = updates.description.trim();
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({
      message: "Product updated successfully.",
      product: formatProduct(product),
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      message: error.message || "Unable to update product.",
    });
  }
});

// DELETE product - Admin only
router.delete("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Unable to delete product." });
  }
});

module.exports = router;
