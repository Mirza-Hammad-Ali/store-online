const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");
const { authenticate, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE NEW ORDER
router.post("/", authenticate, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "postalCode",
    ];

    for (const field of requiredFields) {
      if (!shippingAddress?.[field]?.toString().trim()) {
        return res.status(400).json({
          message: `Please provide ${field}.`,
        });
      }
    }

    if (paymentMethod && paymentMethod !== "cash_on_delivery") {
      return res.status(400).json({
        message: "Invalid payment method.",
      });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      if (
        !mongoose.Types.ObjectId.isValid(item.productId) ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1
      ) {
        return res.status(400).json({
          message: "Invalid product or quantity.",
        });
      }

      const product = await Product.findOne({
        _id: item.productId,
        status: "active",
      });

      if (!product) {
        return res.status(404).json({
          message: "Product not found or unavailable.",
        });
      }

      if (product.stock < Number(item.quantity)) {
        return res.status(400).json({
          message: `${product.name} does not have enough stock.`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: Number(item.quantity),
      });

      subtotal += product.price * Number(item.quantity);
    }

    const shipping = subtotal >= 100 ? 0 : 10;
    const total = subtotal + shipping;

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shipping,
      total,
      paymentMethod: "cash_on_delivery",
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      message: "Failed to create order.",
      error: error.message,
    });
  }
});

// USER: GET MY ORDERS
router.get("/my-orders", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("items.product", "name image")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: GET ALL ORDERS
router.get("/", authenticate, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: UPDATE ORDER STATUS
router.patch("/:id/status", authenticate, adminOnly, async (req, res) => {
  try {
    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({
      message: "Order status updated.",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
