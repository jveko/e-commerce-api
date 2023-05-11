import { DataTypes } from "sequelize";

/**
 * @param {Sequelize} sequelize
 */
const defineTokenModel = (sequelize) => {
  return sequelize.define("Token", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  });
};

export default defineTokenModel;
