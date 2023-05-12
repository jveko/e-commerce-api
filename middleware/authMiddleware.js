import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
      try {
        token = token.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = await User.findByPk(decoded.userId, {
          attributes: {
            exclude: ["password"],
          },
        });
        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (e) {
    next(e);
  }
};

const admin = (req, res, next) => {
  try {
    if (
      req.user &&
      (req.user.roles.contains("admin") ||
        req.user.roles.contains("super_admin"))
    ) {
      next();
    } else {
      res.status(401);
      throw new Error("Not Authorized as an admin");
    }
  } catch (e) {
    next(e);
  }
};

const superAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.roles.contains("super_admin")) {
      next();
    } else {
      res.status(401);
      throw new Error("Not Authorized as an admin");
    }
  } catch (e) {
    next(e);
  }
};

export { protect, admin, superAdmin };
