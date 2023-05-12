import express from "express";
import { errorHandler } from "./middleware/errorMiddleware.js";
import sequelize from "./models/index.js";
import dotenv from "dotenv";
import { importData } from "./seeder.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

await sequelize.sync({ force: true });
await importData();

const app = express();

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/orders", orderRoutes);
// app.get("/api/config/paypal", (req, res) =>
//   res.send(process.env.PAYPAL_CLIENT_ID)
// );

// const __dirname = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/build")));
//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is Runn....");
//   });
// }
app.get("/", (req, res) => {
  res.send("API is Runn....");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

//runingin
