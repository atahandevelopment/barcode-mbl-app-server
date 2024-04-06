import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import customerRoute from "../routes/customerRoute.js";
import productRoute from "../routes/productRoute.js";
import saleRoute from "../routes/saleRoute.js";
import arrivedRoute from "../routes/arrivedRoute.js";
import cors from "cors";

const app = express();

dotenv.config();

app.use(express.json());

app.use(cors());

const apiSecretUrl = process.env.API_SECRET_URL;

app.use(`${apiSecretUrl}/customers`, customerRoute);
app.use(`${apiSecretUrl}/products`, productRoute);
app.use(`${apiSecretUrl}/sales`, saleRoute);
app.use(`${apiSecretUrl}/arrived-products`, arrivedRoute);

const PORT = process.env.PORT || 5000;

export const server = () => {
  app.listen(PORT, () => {
    mongoose
      .connect(process.env.DB_URL)
      .then(() => {
        console.log(
          "Db bağlantısı başarılı." + `${PORT}'inci portta dinliyor.`
        );
      })
      .catch((err) => console.log(err));
  });
};
