import { Product, Review } from "../models/index.js";
import { Op } from "sequelize";

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = async (req, res, next) => {
  try {
    const { category, filter, from, to, keyword } = req.query;
    const where = {};
    const order = [];
    if (category) {
      where["category"] = {
        [Op.contains]: [category],
      };
    } else if (filter) {
      switch (filter) {
        case "Rating":
          order.push("rating");
          break;
        case "date":
          order.push("createdAt");
          break;
        case "highprice":
          order.push(["price", "DESC"]);
          break;
        case "lowprice":
          order.push(["price", "ASC"]);
          break;
      }
    } else if (from && to) {
      where["price"] = {
        [Op.lte]: to,
        [Op.gte]: from,
      };
    } else {
      where["name"] = {
        [Op.iLike]: `%${keyword}%`,
      };
    }
    const products = await Product.findAll({
      where: where,
      order: order,
    });
    res.json(products);
  } catch (e) {
    next(e);
  }
};

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (e) {
    next(e);
  }
};

// @desc Delete a product
// @route GET /api/products/:id
// @access Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (product) {
      await product.destroy();
      res.json({ message: "Product Removed" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (e) {
    next(e);
  }
};

// @desc Create a product
// @route Post /api/products
// @access Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const product = Product.create({
      name: "Sample name",
      price: 0,
      description: "sample description",
      user: req.user._id,
      sizes: [],
      images: [
        "https://i.imgur.com/QN2BSdJ.jpg",
        "https://i.imgur.com/QN2BSdJ.jpg",
        "https://i.imgur.com/QN2BSdJ.jpg",
      ],
      category: [],
      countInStock: 0,
      numReviews: 0,
    });
    res.status(201).json({
      message: "Successfully Created Product",
      statusCode: 201,
    });
  } catch (e) {
    next(e);
  }
};

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, price, description, category, sizes, Images, countInStock } =
      req.body;
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (product) {
      const updatedProduct = await product.update({
        name: name,
        price: price,
        description: description,
        category: category,
        sizes: sizes,
        images: Images,
        countInStock: countInStock,
        updatedById: req.user.id,
      });
      res.json({
        message: "Successfully Updated Product",
        statusCode: 200,
      });
    } else {
      res.status(404);
      throw new Error("Product Not found");
    }
  } catch (e) {
    next(e);
  }
};

// @desc Create new Review
// @route PUT /api/products/:id/reviews
// @access Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [Review],
    });
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(404);
        throw new Error("Product Already Review");
      }
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product Not found");
    }
  } catch (e) {
    next(e);
  }
};

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
