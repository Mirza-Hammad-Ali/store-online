const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const { authenticate, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();
// PLACE NEW ORDER
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod = "cash_on_delivery",
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }
    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "postalCode",
    ];

    const missingField = requiredFields.some(
      (field) => !shippingAddress?.[field]?.toString().trim()
    );

    if (missingField) {
      return res.status(400).json({
        message: "Please complete all shipping details.",
      });
    }

    if (paymentMethod !== "cash_on_delivery") {
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
          message: "A product in your cart is unavailable.",
        });
      }

      const quantity = Number(item.quantity);

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `${product.name} does not have enough stock.`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      });

      subtotal += product.price * quantity;
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
      paymentMethod,
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Unable to place order." });
  }
});

// LOGGED-IN USER ORDERS
router.get("/my-orders", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name image")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error("My orders error:", error);
    res.status(500).json({ message: "Unable to fetch orders." });
  }
});

// ALL ORDERS - ADMIN ONLY
router.get("/", authenticate, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error("Admin orders error:", error);
    res.status(500).json({ message: "Unable to fetch orders." });
  }
});

// UPDATE ORDER STATUS - ADMIN ONLY
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
      return res.status(400).json({ message: "Invalid order status." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({
      message: "Order status updated successfully!",
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ message: "Unable to update order." });
  }
});

module.exports = router;
