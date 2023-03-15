import express from "express";
import { Router } from "express";
import { appProducts } from "./appProduct.js";
import { appCarts } from "./appCart.js";

export const apiRouter = Router();

apiRouter.use(express.json());
apiRouter.use(express.urlencoded({ extended: true }));

apiRouter.use("/products", appProducts);
apiRouter.use("/carts", appCarts);
