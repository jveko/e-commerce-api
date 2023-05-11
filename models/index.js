import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import defineUserModel from "./userModel.js";
import defineProductModel from "./productModel.js";
import defineTokenModel from "./tokenModel.js";
import defineReviewModel from "./reviewModel.js";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: true,
  }
);

// Declare Model
export const User = defineUserModel(sequelize);
export const Token = defineTokenModel(sequelize);
export const Product = defineProductModel(sequelize);
export const Review = defineReviewModel(sequelize);

// Associations
User.hasMany(Token, {
  sourceKey: "id",
  foreignKey: "userId",
});
Token.belongsTo(User, {
  targetKey: "id",
  foreignKey: "userId",
});

export default sequelize;
