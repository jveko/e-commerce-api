import dotenv from "dotenv";
import users from "./seeds/users.js";
import products from "./seeds/products.js";
import { User, Product } from "./models/index.js";

dotenv.config();
export const importData = async () => {
  try {
    const createUsers = await User.bulkCreate(users);
    const sampleProducts = products.map((product) => {
      return { ...product, user: createUsers[0].dataValues.id };
    });
    await Product.bulkCreate(sampleProducts);
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
};
