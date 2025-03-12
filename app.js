const express = require("express");
const path = require("path");
const app = express();
const userModel = require("./models/users");
const categoryModel = require("./models/categories");
const productModel = require("./models/product");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const Category = require("./models/categories");
const multer = require("multer");
const mongoose = require("mongoose");
const cartRoutes = require("./routes/cart");
const adminRoutes = require("./routes/admin"); // Admin Panel

const session = require("express-session");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(session({ secret: "secretkey", resave: false, saveUninitialized: true }));
app.use(cartRoutes);
app.use(adminRoutes);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save images in "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/men", async (req, res) => {
  try {
    const products = await productModel.find({ gender: "Men" }); // Fetch men’s products from DB
    res.render("men", { products }); // Pass products to the EJS template
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/women", async (req, res) => {
  try {
    const products = await productModel.find({ gender: "Women" }); // Fetch men’s products from DB
    res.render("Women", { products }); // Pass products to the EJS template
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/bride", (req, res) => {
  res.render("bride");
});
app.get("/groom", (req, res) => {
  res.render("groom");
});
app.get("/wedding", (req, res) => {
  res.render("wedding");
});
app.get("/sale", (req, res) => {
  res.render("sale");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/admin/dashboard", (req, res) => {
  res.render("./backendviews/dashboard");
});
app.get("/admin/categories", (req, res) => {
  res.render("./backendviews/categories");
});
app.get("/admin/product", (req, res) => {
  res.render("./backendviews/product");
});
app.get("/admin/order", (req, res) => {
  res.render("./backendviews/order");
});
app.get("/aboutus", (req, res) => {
  res.render("aboutus");
});
app.get("/corporateinfo", (req, res) => {
  res.render("corporateinfo");
});
app.get("/termandcondition", (req, res) => {
  res.render("termandcondition");
});
app.get("/privacypolicy", (req, res) => {
  res.render("privacypolicy");
});
app.get("/cookiepolicy", (req, res) => {
  res.render("cookiepolicy");
});
app.get("/shippingpolicy", (req, res) => {
  res.render("shippingpolicy");
});
app.get("/orderandshipment", (req, res) => {
  res.render("orderandshipment");
});
app.get("/returnandexchange", (req, res) => {
  res.render("returnandexchange");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/FAQs", (req, res) => {
  res.render("FAQs");
});
app.get("/gifts", (req, res) => {
  res.render("gifts");
});
app.get("/store-locator", (req, res) => {
  res.render("storelocator");
});
app.get("/sitemap", (req, res) => {
  res.render("sitemap");
});
app.get("/cart", (req, res) => {
  res.render("cart");
});

app.get("/category/:category", async (req, res) => {
  try {
    let category = req.params.category;

    // Convert to ObjectId only if your schema uses ObjectId
    if (mongoose.Types.ObjectId.isValid(category)) {
      category = new mongoose.Types.ObjectId(category);
    }

    const products = await productModel.find({ category });
    res.render("category", { products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server Error");
  }
});

// login
app.post("/create-user", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Check if user already exists
    let flag = await userModel.findOne({ email });
    if (flag) return res.status(400).send("User already registered");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user
    let user = await userModel.create({
      username,
      email,
      password: hash,
    });

    // Generate token
    let token = jwt.sign({ email: email, userid: user._id }, "shhh", {
      expiresIn: "1h",
    });

    // // Set cookie
    res.cookie("token", token, { httpOnly: true, secure: true });

    res.status(201).redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
app.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    // Check if user exists
    let user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not registered" });
    if (user.role === "admin") return res.redirect("/admin");

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate token
    let token = jwt.sign({ email: user.email, userid: user._id }, "shhh", {
      expiresIn: "1h",
    });

    // Set cookie
    res.cookie("token", token, { httpOnly: true, secure: true });

    res.status(200).redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// categories
app.post("/create-category", async (req, res) => {
  try {
    const { categoryName, categoryGender } = req.body;
    const newCategory = new categoryModel({ categoryName, categoryGender });
    await newCategory.save();

    res.json({
      success: true,
      message: "Category added successfully!",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
});

app.get("/get-category", async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.render("./backendviews/categories", { categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
app.get("/get-categories", async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
app.delete("/delete-category/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
});
app.put("/update-category/:id", async (req, res) => {
  try {
    const { categoryName, categoryGender } = req.body;
    const categoryId = req.params.id;

    if (!categoryName || !categoryGender) {
      return res
        .status(400)
        .json({ message: "Both category name and gender are required." });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { categoryName, categoryGender },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({
      message: "Category updated successfully.",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
}); 
app.get("/get-product", async (req, res) => {
  try {
    const products = await productModel.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).send("Error fetching products");
  }
});
 
app.post("/create-product", upload.single("image"), async (req, res) => {
  try {
    const { clientName, productName, category, price, gender, discount } =
      req.body;
    const image = req.file ? req.file.path : null; // Get image path

    // Validate required fields
    if (
      !clientName ||
      !productName ||
      !category ||
      !price ||
      !image ||
      !gender ||
      !discount
    ) {
      return res
        .status(400)
        .json({ message: "All fields including image are required" });
    }

    // Find the category by name to get the correct ObjectId
    const categoryDoc = await categoryModel.findOne({ categoryName: category });
    if (!categoryDoc) {
      return res.status(400).json({ message: "Invalid category selected" });
    }

    // Create a new product with the correct category ObjectId
    const product = await productModel.create({
      clientName,
      productName,
      category: categoryDoc._id, // Store ObjectId instead of string
      price,
      image,
      gender,
      discount,
    });

    res.status(201).redirect("/get-products");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});
app.get("/get-products", async (req, res) => {
  try {
    const products = await productModel.find().populate("category");
    const categories = await categoryModel.find();
    res.render("./backendviews/product", { products, categories });
  } catch (error) {
    res.status(500).send("Error fetching products: " + error.message);
  }
});
app.get("/edit-product/:id", async (req, res) => {
  try {
    const products = await productModel.findById(req.params.id);
    const categories = await categoryModel.find();

    res.render("./backendviews/editProduct", { products, categories });
  } catch (error) {
    res.status(500).send("Error fetching product: " + error.message);
  }
});
app.post("/update-product/:id", upload.single("image"), async (req, res) => {
  try {
    const { clientName, productName, category, gender, price } = req.body;
    const updateData = { clientName, productName, category, gender, price };

    if (req.file) updateData.image = req.file.path;

    await productModel.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/get-products");
  } catch (error) {
    res.status(500).send("Error updating product: " + error.message);
  }
});
app.post("/delete-product/:id", async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.redirect("/get-products");
  } catch (error) {
    res.status(500).send("Error deleting product: " + error.message);
  }
});

app.get("/get-sales", async (req, res) => {
  try {
    // Fetch only products that have a discount
    const products = await productModel
      .find({ discount: { $gt: 0 } })
      .populate("category");
    const categories = await categoryModel.find();

    res.render("./backendviews/sale", { products, categories });
  } catch (error) {
    res
      .status(500)
      .send("Error fetching discounted products: " + error.message);
  }
});
app.get("/get-sale", async (req, res) => {
  try {
    // Fetch only products that have a discount
    const products = await productModel
      .find({ discount: { $gt: 0 } })
      .populate("category");
    const categories = await categoryModel.find();

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .send("Error fetching discounted products: " + error.message);
  }
});

app.get("/get-orders", async (req, res) => {
  try {
    const orders = await orderModel.find().populate("product");
    res.render("./backendviews/orders", { orders });
  } catch (error) {
    res.status(500).send("Error fetching orders: " + error.message);
  }
});
app.get("/get-order", async (req, res) => {
  try {
    const orders = await orderModel.find().populate("product");
    res.json(orders);
  } catch (error) {
    res.status(500).send("Error fetching orders: " + error.message);
  }
});




app.listen(8080);
