import { DataTypes } from "sequelize";

/**
 * @param {Sequelize} sequelize
 */
const defineReviewModel = (sequelize) => {
  return sequelize.define("Review", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
};

export default defineReviewModel;
