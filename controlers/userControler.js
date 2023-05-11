import { Token, User } from "../models/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await Token.create({
      userId: user.id,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    res.json({
      message: "Successfully Login",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      statusCode: 200,
    });
  } catch (e) {
    next(e);
  }
};

// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({
      where: {
        email: email,
      },
    });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        message: "Successfully Register User",
        data: {
          id: user.id,
        },
        statusCode: 201,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
};

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (e) {
    next(e);
  }
};

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password || user.password;
      }

      const updatedUser = await user.save();
      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (e) {
    next(e);
  }
};

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.isAdmin;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (e) {
    next(e);
  }
};

// @desc Get All users
// @route GET /api/users
// @access Private/admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (e) {
    next(e);
  }
};
// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/admin
const getUserByID = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ["password"],
      },
    });
    if (user) {
      res.json(user);
      console.log(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (e) {
    next(e);
  }
};
// @desc Delete User
// @route DELETE /api/users/:id
// @access Private/admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: "User removed" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (e) {
    next(e);
  }
};

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserByID,
  updateUser,
};
