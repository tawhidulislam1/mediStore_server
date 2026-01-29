import express, { Application } from "express";
import cors from "cors";
import { notFound } from "./middlewere/notFound";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { CategoryRouter } from "./modules/Category/category.route";
import { MedicinesRouter } from "./modules/medicine/medicine.route";
import { ReviewRouter } from "./modules/reviews/review.route";
import { CartRouter } from "./modules/cart/cart.route";

const app: Application = express();
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/admin/category", CategoryRouter);
app.use("/medicine", MedicinesRouter);
app.use("/review", ReviewRouter);
app.use("/cart", CartRouter);
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use(notFound);

export default app;
