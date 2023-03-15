import express from "express";
import { Router } from "express";
import Carts from "../carts.js";
import { randomUUID } from "crypto";
import cartsManager from "../cartManager.js";
import { pm } from "./appProduct.js";

const cm = new cartsManager("./database/carts.json");

export const appCarts = Router();
appCarts.use(express.json());
appCarts.use(express.urlencoded({ extended: true }));

appCarts.post("/", async (req, res, next) => {
  try {
    const newcart = new Carts({ id: randomUUID() });
    const agregada = await cm.addCart(newcart);
    res.json(agregada);
  } catch (error) {
    next(error);
  }
});

appCarts.get("/:cid", async (req, res, next) => {
  try {
    const productosEnCarro = await cm.getProductInCartById(req.params.cid);
    res.json(productosEnCarro);
  } catch (error) {
    next(error);
  }
});

appCarts.post("/:cid/product/:pid", async (req, res, next) => {
  try {
    await pm.getProductById(Number(req.params.pid));
  } catch (error) {
    return next(error);
  }
  try {
    const product = await cm.addProductInCart(
      req.params.cid,
      Number(req.params.pid)
    );
    res.json(product);
  } catch (error) {
    next(error);
  }
});
