
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
  return {
    id: product._id.toString(),
    name: product.name,
    category: product.category,
    price: product.price,
    tag: product.tag,
    image: product.image,
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
    res.status(500).json({ message: "Unable to fetch product." });
  }
});

// ADD product - Admin only
router.post("/", authenticate, adminOnly, async (req, res) => {
  try {
    const { name, category, price, tag, image, description, stock, status } =
      req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      !["Wearables", "Accessories", "Living"].includes(category) ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      typeof image !== "string" ||
      !image.trim() ||
      image.trim().length > 2048 ||
      (tag !== undefined && typeof tag !== "string") ||
      (description !== undefined && typeof description !== "string") ||
      (stock !== undefined &&
        (!Number.isInteger(stock) || stock < 0)) ||
      (status !== undefined && !["active", "draft"].includes(status))
    ) {
      return res.status(400).json({
        message: "Please provide valid product details.",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      category,
      price,
      tag: tag || "",
      image: image.trim(),
      description: description || "",
      stock: stock ?? 0,
      status: status || "active",
    });

    res.status(201).json({
      message: "Product added successfully.",
      product: formatProduct(product),
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to add product." });
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
      (updates.image !== undefined &&
        (typeof updates.image !== "string" ||
          !updates.image.trim() ||
          updates.image.length > 2048)) ||
      (updates.description !== undefined &&
        typeof updates.description !== "string") ||
      (updates.stock !== undefined &&
        (!Number.isInteger(updates.stock) || updates.stock < 0)) ||
      (updates.status !== undefined &&
        !["active", "draft"].includes(updates.status))
    ) {
      return res.status(400).json({ message: "Invalid product updates." });
    }

    if (updates.name) updates.name = updates.name.trim();
    if (updates.image) updates.image = updates.image.trim();

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
    res.status(500).json({ message: "Unable to update product." });
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
    res.status(500).json({ message: "Unable to delete product." });
  }
});

module.exports = router;
