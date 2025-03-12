const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Product = require("../models/product"); 
const Order = require("../models/order");
// Add product to cart
router.post("/add-to-cart", async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Fetch product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Save to Cart
    const newCartItem = new Cart({
      product: productId,
      priceAtAddition: product.price, // Store price at the time of addition
    });

    await newCartItem.save();
    res.json({ message: "Product added to cart successfully!" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch and render cart page
router.get("/cart", async (req, res) => {
  try {
    const cartItems = await Cart.find().populate("product");
    res.render("cart", { cart: cartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Checkout Route (Process Payment)
router.post("/checkout", async (req, res) => {
  try {
    const cartItems = await Cart.find().populate("product");

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => sum + item.priceAtAddition, 0);

    // Create new order
    const newOrder = new Order({
      products: cartItems.map(item => ({
        product: item.product._id,
        priceAtOrder: item.priceAtAddition
      })),
      totalAmount: totalAmount
    });

    await newOrder.save();

    // Clear Cart After Checkout
    await Cart.deleteMany({});

    // Redirect to Thank You Page
    res.redirect("/thank-you");

  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// thank you
router.get("/thank-you", (req, res) => {
  res.render("thank-you");
});

module.exports = router;
